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

const transactionRouter = Router();

transactionRouter
  .route("/")
  .get(findAll)
  .post(validateReqPayload(Transaction), create);

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

transactionRouter.route("/user/:id").get(getTransactionsByUserId);
transactionRouter.route("/:id/:notes").post(addNote);

export default transactionRouter;
