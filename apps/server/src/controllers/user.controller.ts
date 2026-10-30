import { AppDataSource } from "../db/index.ts";
import { User } from "../entities/User.entity.ts";
import { UserService } from "../services/user.service.ts";
import { ApiResponse } from "../utils/api-response.ts";
import { asyncHandler } from "../utils/async-handler.ts";
import { Request, Response } from "express";

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
  const users = await userService.getAllUsers();
  if (users) {
    return res
      .status(201)
      .json(new ApiResponse(201, users, "Users fetched successfully"));
  }
});
export { createUser, getAllUsers };
