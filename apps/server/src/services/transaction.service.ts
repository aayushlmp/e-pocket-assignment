import { Repository } from "typeorm";
import { Transaction } from "../entities/Transaction.entity.ts";
import {
  ITransaction,
  QueryParamOption,
} from "@e-pocket-assignment/shared/interfaces";
import { ApiError } from "../utils/api-error.ts";

export class TransactionService {
  constructor(private transactionRepository: Repository<Transaction>) {}
  async findAll(query: QueryParamOption) {
    try {
      const page = Number(query.page) || 1;
      const limit = Number(query.limit) || 10;
      const skip = (page - 1) * limit;

      const sortBy = query.sortBy || "createdAt";
      const order = query.order === "ASC" ? "ASC" : "DESC";

      const queryBuilder =
        this.transactionRepository.createQueryBuilder("transaction");

      if (query.status) {
        queryBuilder.andWhere("transaction.status = :status", {
          status: query.status,
        });
      }

      if (query.search) {
        queryBuilder.andWhere(
          "(transaction.customerName LIKE :search OR transaction.sourceCurrencyCode LIKE :search OR transaction.targetCurrencyCode LIKE :search)",
          { search: `%${query.search}%` }
        );
      }

      queryBuilder
        .orderBy(`transaction.${sortBy}`, order)
        .skip(skip)
        .take(limit);

      const [transactions, total] = await queryBuilder.getManyAndCount();

      return {
        transactions,
        pagination: {
          total,
          itemCount: transactions.length,
          limit,
          totalPages: Math.ceil(total / limit),
          currentPage: page,
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
        // select: {
        //   notes: {
        //     id: true,
        //     comment: true,
        //   },
        // },
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

      const updatedTransaction = this.transactionRepository.merge(
        existingTransaction,
        transaction
      );
      return await this.transactionRepository.save(updatedTransaction);
    } catch (error) {
      if (error instanceof ApiError) {
        throw new ApiError(
          error.statusCode || 500,
          error.message ?? "Failed to delete transaction details"
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
