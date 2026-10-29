import { Router } from "express";
import {
  addNote,
  create,
  deleteById,
  getTransactionById,
  getTransactionsByUserId,
  list,
  update,
} from "../controllers/transaction.controller.ts";
import { validateReqPayload } from "../middlewares/validate-payload.middleware.ts";
import { Transaction } from "../entities/Transaction.entity.ts";

const transactionRouter = Router();

transactionRouter
  .route("/")
  .get(list)
  .post(validateReqPayload(Transaction), create);

transactionRouter
  .route("/:id")
  .get(getTransactionById)
  .patch(validateReqPayload(Transaction), update)
  .delete(deleteById);

transactionRouter.route("/user/:id").get(getTransactionsByUserId);

transactionRouter.route("/:id/:notes").post(addNote);

export default transactionRouter;
