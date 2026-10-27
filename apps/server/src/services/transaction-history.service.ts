import { Repository } from "typeorm";
import { ApiError } from "../utils/api-error.ts";
import { TransactionAuditHistory } from "../entities/TransactionAuditHistory.entity.ts";
import { TransactionStausHistory } from "@e-pocket-assignment/shared/interfaces";

export class TransactionHistoryService {
  constructor(private historyRepository: Repository<TransactionAuditHistory>) {}
  async save(payload: TransactionStausHistory) {
    try {
      return await this.historyRepository.save(payload);
    } catch (error) {
      if (error instanceof ApiError) {
        throw new ApiError(
          error.statusCode || 500,
          error.message ?? "Failed to add transaction history details"
        );
      }
    }
  }
}
