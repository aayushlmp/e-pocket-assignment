import { Router } from "express";
import {
  statusSummary,
  transactionVolume,
  currencyBreakdown,
  feeTrends,
} from "../controllers/graph.controller.ts";

const graphRouter = Router();

graphRouter.get("/status-distribution", statusSummary);
graphRouter.get("/transaction-volume", transactionVolume);
graphRouter.get("/currency-breakdown", currencyBreakdown);
graphRouter.get("/fee-trends", feeTrends);

export default graphRouter;
