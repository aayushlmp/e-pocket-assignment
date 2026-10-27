import { Router } from "express";
import { create, deleteById, getTransactionById, list, update } from "../controllers/transaction.controller.ts";
import { validateReqPayload } from "../middlewares/validate-payload.middleware.ts";
import { Transaction } from "../entities/Transaction.entity.ts";

const router = Router();

router
  .route("/")
  .get(list)
  .post(validateReqPayload(Transaction), create);

router
  .route("/:id")
  .get(getTransactionById)
  .patch(validateReqPayload(Transaction), update)
  .delete(deleteById);

export default router;
