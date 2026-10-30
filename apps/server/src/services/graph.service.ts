import { Repository } from "typeorm";
import { Transaction } from "../entities/Transaction.entity.ts";
import { TransactionStatus } from "@e-pocket-assignment/shared/enums";
import { ApiError } from "../utils/api-error.ts";

export type GraphPeriod = "7d" | "30d" | "90d";

const PERIOD_DAYS: Record<GraphPeriod, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
};

export class GraphService {
  constructor(
    private readonly transactionRepository: Repository<Transaction>
  ) {}

  /**
   * 1. Transaction status distribution
   * Returns the number of transactions grouped by status.
   */
  async getStatusSummary() {
    try {
      const summary = await this.transactionRepository
        .createQueryBuilder("transaction")
        .select("transaction.status", "status")
        .addSelect("COUNT(transaction.id)", "count")
        .groupBy("transaction.status")
        .getRawMany();

      // Include every status, even when its count is zero.
      const counts = new Map(
        summary.map((item) => [item.status, Number(item.count)])
      );

      return Object.values(TransactionStatus).map((status) => ({
        status,
        count: counts.get(status) ?? 0,
      }));
    } catch (error) {
      this.handleError(error, "Failed to fetch transaction status summary");
    }
  }

  /**
   * 2. Transaction volume over time
   * Supported periods: 7d, 30d, 90d.
   */
  async getTransactionVolume(period: GraphPeriod = "90d") {
    try {
      const days = this.getPeriodDays(period);

      return await this.transactionRepository
        .createQueryBuilder("transaction")
        .select("DATE(transaction.createdAt)", "date")
        .addSelect("COUNT(transaction.id)", "count")
        .where(
          `transaction.createdAt >= DATE_SUB(CURDATE(), INTERVAL ${days} DAY)`
        )
        .groupBy("DATE(transaction.createdAt)")
        .orderBy("DATE(transaction.createdAt)", "ASC")
        .getRawMany()
        .then((rows) =>
          rows.map((row) => ({
            date: row.date,
            count: Number(row.count),
          }))
        );
    } catch (error) {
      this.handleError(error, "Failed to fetch transaction volume");
    }
  }

  /**
   * 3. Currency breakdown
   * Groups transactions by source currency.
   */
  async getCurrencyBreakdown() {
    try {
      const summary = await this.transactionRepository
        .createQueryBuilder("transaction")
        .select("transaction.sourceCurrencyCode", "currency")
        .addSelect("COUNT(transaction.id)", "transactionCount")
        .addSelect("SUM(transaction.amount)", "totalAmount")
        .addSelect("SUM(transaction.fees)", "totalFees")
        .groupBy("transaction.sourceCurrencyCode")
        .orderBy("COUNT(transaction.id)", "DESC")
        .getRawMany();

      return summary.map((row) => ({
        currency: row.currency,
        transactionCount: Number(row.transactionCount),
        totalAmount: Number(row.totalAmount ?? 0),
        totalFees: Number(row.totalFees ?? 0),
      }));
    } catch (error) {
      this.handleError(error, "Failed to fetch currency breakdown");
    }
  }

  /**
   * 4. Fee trends over time
   * Returns daily fee totals for the selected period.
   */
  async getFeeTrends(period: GraphPeriod = "30d") {
    try {
      const days = this.getPeriodDays(period);

      const summary = await this.transactionRepository
        .createQueryBuilder("transaction")
        .select("DATE(transaction.createdAt)", "date")
        .addSelect("SUM(transaction.fees)", "totalFees")
        .where(
          `transaction.createdAt >= DATE_SUB(CURDATE(), INTERVAL ${days} DAY)`
        )
        .groupBy("DATE(transaction.createdAt)")
        .orderBy("DATE(transaction.createdAt)", "ASC")
        .getRawMany();

      return summary.map((row) => ({
        date: row.date,
        totalFees: Number(row.totalFees ?? 0),
      }));
    } catch (error) {
      this.handleError(error, "Failed to fetch fee trends");
    }
  }

  /**
   * Validates the period before using it in a SQL expression.
   */
  private getPeriodDays(period: GraphPeriod): number {
    const days = PERIOD_DAYS[period];

    if (!days) {
      throw new ApiError(400, "Invalid period. Use 7d, 30d, or 90d.");
    }

    return days;
  }

  /**
   * Consistent error handling across all chart methods.
   */
  private handleError(error: unknown, message: string) {
    if (error instanceof ApiError) {
      throw new ApiError(error.statusCode || 500, error.message ?? message);
    }
  }
}
