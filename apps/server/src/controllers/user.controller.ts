import { AppDataSource } from "../db/index.ts";
import { User } from "../entities/User.entity.ts";
import { UserService } from "../services/user.service.ts";
import { ApiResponse } from "../utils/api-response.ts";
import { asyncHandler } from "../utils/async-handler.ts";
import { Request, Response } from "express";
import { UserRole } from "@e-pocket-assignment/shared/enums";
import { PaginationQuery } from "../interfaces/query.interface.ts";

const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);

const createUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.save(req.body);
  if (user) {
    return res
      .status(201)
      .json(new ApiResponse(201, user, "User added successfully"));
  }
});
const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, search, sortBy, order, role } = req.query;
  const queryParams = {
    ...req.query,
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    search: search as string,
    sortBy: sortBy as string,
    order: order as "ASC" | "DESC",
    role: role as UserRole,
  } as PaginationQuery;
  const users = await userService.findAll(queryParams);
  if (users) {
    return res
      .status(201)
      .json(new ApiResponse(201, users, "Users fetched successfully"));
  }
});
export { createUser, getAllUsers };
