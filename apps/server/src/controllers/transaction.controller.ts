import { Response } from "express";
import { AppDataSource } from "../db/index.ts";
import { Transaction } from "../entities/Transaction.entity.ts";
import { AuthenticatedRequest } from "../interfaces/token.interface.ts";
import { TransactionService } from "../services/transaction.service.ts";
import { asyncHandler } from "../utils/async-handler.ts";
import { ApiResponse } from "../utils/api-response.ts";
import { TransactionStatus } from "@e-pocket-assignment/shared/enums";
import { QueryParamOption } from "@e-pocket-assignment/shared/interfaces";
import { ApiError } from "../utils/api-error.ts";
import { Note } from "../entities/Note.entity.ts";
import { NoteService } from "../services/note.service.ts";

const transactionRepository = AppDataSource.getRepository(Transaction);
const noteRepository = AppDataSource.getRepository(Note);
const transactionService = new TransactionService(transactionRepository);
const noteService = new NoteService(noteRepository);

const list = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { page, limit, search, sortBy, order, status } = req.query;
  const queryParams = {
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    search: search as string,
    sortBy: sortBy as string,
    order: order as "ASC" | "DESC",
    status: status as TransactionStatus,
  } as QueryParamOption;
  const transactions = await transactionService.findAll(queryParams);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { ...transactions },
        "Transactions fetched successfully"
      )
    );
});

const getTransactionById = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    if (!id) {
      throw new ApiError(404, `Transaction with ID ${id} not found`);
    }
    const transaction = await transactionService.getTransactionById(
      id as string
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          transaction,
          "Transaction details fetched successfully"
        )
      );
  }
);
const getTransactionsByUserId = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    if (!id) {
      throw new ApiError(404, `Customer with ID ${id} not found`);
    }
    const transactions = await transactionService.getTransactionsByUserId(
      id as string
    );
    return res
      .status(200)
      .json(
        new ApiResponse(200, transactions, "Transactions fetched successfully")
      );
  }
);

const create = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const transaction = await transactionService.save(req.body);
    if (transaction) {
      return res
        .status(201)
        .json(
          new ApiResponse(201, transaction, "Transaction added successfully")
        );
    }
  }
);

const update = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    if (!id) {
      throw new ApiError(404, `Transaction with ID ${id} not found`);
    }
    const transaction = await transactionService.update(id as string, req.body);

    return res
      .status(200)
      .json(
        new ApiResponse(200, transaction, "Transaction updated successfully")
      );
  }
);
const deleteById = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    if (!id) {
      throw new ApiError(404, `Transaction with ID ${id} not found`);
    }
    await transactionService.delete(id as string);

    return res
      .status(200)
      .json(new ApiResponse(200, "Transaction deleted successfully"));
  }
);
const addNote = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params as { id: string };
    const userId = req.user?.id;

    if (!id) {
      throw new ApiError(404, `Transaction with ID ${id} not found`);
    }
    if (!userId) {
      throw new ApiError(401, "Unauthorized Access");
    }
    const { comment } = req.body;
    const payload = { transactionId: id, userId, comment };
    const transaction = await noteService.addNote(payload);
    return res
      .status(201)
      .json(new ApiResponse(201, transaction, "Note added successfully"));
  }
);
export {
  list,
  create,
  update,
  deleteById,
  addNote,
  getTransactionById,
  getTransactionsByUserId,
};
