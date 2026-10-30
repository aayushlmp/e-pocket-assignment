import { Repository } from "typeorm";
import { User } from "../entities/User.entity.ts";
import { ApiError } from "../utils/api-error.ts";
import { CreateUserDto, IUser } from "@e-pocket-assignment/shared/interfaces";
import { Status, UserRole } from "@e-pocket-assignment/shared/enums";
import bcrypt from "bcrypt";

export class UserService {
  constructor(private userRepository: Repository<User>) {}
  async save(user: CreateUserDto) {
    try {
      const { password: plainTextPassword } = user;
      const hashPassword = await bcrypt.hash(plainTextPassword, 10);
      const payload = {
        ...user,
        password: hashPassword,
        role: UserRole.ADMIN,
      };
      const result = await this.userRepository.save(payload);
      const { password, ...savedUser } = result;
      return savedUser;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new ApiError(
          error.statusCode || 500,
          error.message ?? "Failed to add user details"
        );
      }
    }
  }
  async getAllUsers() {
    try {
      return await this.userRepository.find({
        select: {
          password: false,
        },
        order: {
          createdAt: "DESC",
        },
      });
    } catch (error) {
      if (error instanceof ApiError) {
        throw new ApiError(
          error.statusCode || 500,
          error.message ?? "Failed to load users list"
        );
      }
    }
  }
}
