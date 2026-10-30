import { Response } from "express";
import { AppDataSource } from "../db/index.ts";
import { Transaction } from "../entities/Transaction.entity.ts";
import { AuthenticatedRequest } from "../interfaces/token.interface.ts";
import { asyncHandler } from "../utils/async-handler.ts";
import { ApiResponse } from "../utils/api-response.ts";
import { ApiError } from "../utils/api-error.ts";
import { GraphPeriod, GraphService } from "../services/graph.service.ts";

const transactionRepository = AppDataSource.getRepository(Transaction);
const graphService = new GraphService(transactionRepository);

const getPeriod = (value: unknown): GraphPeriod => {
  if (value === undefined) return "7d";

  if (value === "7d" || value === "30d" || value === "90d") {
    return value;
  }

  throw new ApiError(400, "Invalid period. Use 7d, 30d, or 90d.");
};

export const statusSummary = asyncHandler(
  async (_req: AuthenticatedRequest, res: Response) => {
    const data = await graphService.getStatusSummary();

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          data,
          "Transaction status distribution fetched successfully"
        )
      );
  }
);

export const transactionVolume = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const period = getPeriod(req.query.period);
    const data = await graphService.getTransactionVolume(period);
    console.log(data);
    res
      .status(200)
      .json(
        new ApiResponse(200, data, "Transaction volume fetched successfully")
      );
  }
);

export const currencyBreakdown = asyncHandler(
  async (_req: AuthenticatedRequest, res: Response) => {
    const data = await graphService.getCurrencyBreakdown();

    res
      .status(200)
      .json(
        new ApiResponse(200, data, "Currency breakdown fetched successfully")
      );
  }
);

export const feeTrends = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const period = getPeriod(req.query.period);
    const data = await graphService.getFeeTrends(period);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          data,
          "Transaction fee trends fetched successfully"
        )
      );
  }
);
