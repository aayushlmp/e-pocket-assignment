import { Router } from "express";
import {
  addNote,
  completedTransactions,
  create,
  deleteById,
  findAll,
  getTransactionById,
  getTransactionsByUserId,
  pendingTransactions,
  totalTransactions,
  totalTransferAmount,
  update,
} from "../controllers/transaction.controller.ts";
import { validateReqPayload } from "../middlewares/validate-payload.middleware.ts";
import { Transaction } from "../entities/Transaction.entity.ts";
import { verifyJWT } from "../middlewares/auth.middleware.ts";
import { requirePermission } from "../config/permissions.ts";
import { Permission } from "@e-pocket-assignment/shared/constants";

const transactionRouter = Router();

transactionRouter
  .route("/")
  // .get(verifyJWT, requirePermission(Permission.TRANSACTION_VIEW), findAll)
  .get(verifyJWT, requirePermission(Permission.TRANSACTION_VIEW), findAll)
  .post(verifyJWT, validateReqPayload(Transaction), create);

transactionRouter
  .route("/:id")
  .get(getTransactionById)
  .patch(validateReqPayload(Transaction), update)
  .delete(deleteById);

// Transaction summary routes
transactionRouter.get("/summary/total", totalTransactions);
transactionRouter.get("/summary/transfer-amount", totalTransferAmount);
transactionRouter.get("/summary/pending", pendingTransactions);
transactionRouter.get("/summary/completed", completedTransactions);

transactionRouter.get("/user/:id", getTransactionsByUserId);
transactionRouter.post("/:id/:notes", addNote);

export default transactionRouter;
