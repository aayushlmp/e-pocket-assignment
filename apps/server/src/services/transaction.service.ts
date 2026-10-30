import { Repository } from "typeorm";
import { Transaction } from "../entities/Transaction.entity.ts";
import { ITransaction } from "@e-pocket-assignment/shared/interfaces";
import { PaginationQuery } from "../interfaces/query.interface.ts";
import { PaginationService } from "./pagination.service.ts";
import { ApiError } from "../utils/api-error.ts";

export class TransactionService {
  constructor(private transactionRepository: Repository<Transaction>) {}
  async findAll(query: PaginationQuery) {
    try {
      const queryBuilder =
        this.transactionRepository.createQueryBuilder("transaction");

      const result = await PaginationService.paginate(queryBuilder, query, {
        alias: "transaction",
        searchableFields: [
          "customerName",
          "sourceCurrencyCode",
          "targetCurrencyCode",
        ],
        filterableFields: [
          "status",
          "sourceCurrencyCode",
          "targetCurrencyCode",
        ],
        rangeFields: ["amount", "createdAt"],
        sortableFields: ["createdAt", "amount", "status"],
        defaultSortBy: "createdAt",
        defaultOrder: "DESC",
      });

      return {
        transactions: result.data,
        pagination: {
          ...result.pagination,
          query,
        },
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw new ApiError(
          error.statusCode || 500,
          error.message ?? "Failed to delete transaction details"
        );
      }
    }
  }
  async getTransactionById(id: string) {
    try {
      const transaction = await this.transactionRepository.findOne({
        where: { id },
        relations: {
          notes: true,
        },
        order: {
          notes: {
            createdAt: "DESC",
          },
        },
      });

      if (!transaction) {
        throw new ApiError(404, `Transaction with ID ${id} not found`);
      }

      return transaction;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new ApiError(
          error.statusCode || 500,
          error.message ?? "Failed to delete transaction details"
        );
      }
    }
  }
  async getTransactionsByUserId(id: string) {
    try {
      const transaction = await this.transactionRepository.find({
        where: { customerId: id },
        relations: {
          notes: true,
        },
        order: {
          notes: {
            createdAt: "DESC",
          },
        },
      });

      if (!transaction) {
        throw new ApiError(404, `Transactions for USER ${id} not found`);
      }
      return transaction;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new ApiError(
          error.statusCode || 500,
          error.message ?? "Failed to fetch transactions"
        );
      }
    }
  }
  async getTransactionStatusById(id: string) {
    try {
      const transaction = await this.transactionRepository.findOne({
        where: { id },
        select: {
          id: true,
          status: true,
        },
      });

      if (!transaction) {
        throw new ApiError(404, `Transaction with ID ${id} not found`);
      }

      return { id: transaction.id, status: transaction.status };
    } catch (error) {
      if (error instanceof ApiError) {
        throw new ApiError(
          error.statusCode || 500,
          error.message ?? "Failed to fetch transaction status"
        );
      }
    }
  }
  async save(transaction: ITransaction) {
    try {
      return await this.transactionRepository.save(transaction);
    } catch (error) {
      if (error instanceof ApiError) {
        throw new ApiError(
          error.statusCode || 500,
          error.message ?? "Failed to add transaction details"
        );
      }
    }
  }
  async update(id: string, transaction: Partial<ITransaction>) {
    try {
      const existingTransaction = await this.transactionRepository.findOne({
        where: { id },
      });

      if (!existingTransaction) {
        throw new ApiError(404, `Transaction with ID ${id} not found`);
      }

      const payload = this.transactionRepository.merge(
        existingTransaction,
        transaction
      );
      return await this.transactionRepository.save(payload);
    } catch (error) {
      if (error instanceof ApiError) {
        throw new ApiError(
          error.statusCode || 500,
          error.message ?? "Failed to update details"
        );
      }
    }
  }
  async delete(id: string) {
    try {
      const transaction = await this.transactionRepository.findOne({
        where: { id },
        relations: {
          notes: true,
        },
      });

      if (!transaction) {
        throw new ApiError(404, `Transaction with ID ${id} not found`);
      }
      return await this.transactionRepository.remove(transaction);
    } catch (error) {
      if (error instanceof ApiError) {
        throw new ApiError(
          error.statusCode || 500,
          error.message ?? "Failed to delete transaction details"
        );
      }
    }
  }
}
