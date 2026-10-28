import jwt, { type SignOptions } from "jsonwebtoken";
import type { StringValue } from "ms";
import bcrypt from "bcrypt";
import { User } from "../entities/User.entity.ts";
import { Repository } from "typeorm";
import { TokenPayload } from "../interfaces/token.interface.ts";
import { Status } from "@e-pocket-assignment/shared/enums";
import { ApiError } from "../utils/api-error.ts";

export class AuthService {
  private readonly ACCESS_TOKEN_SECRET =
    process.env.ACCESS_TOKEN_SECRET ?? "ACCESS_TOKEN_SECRET";
  private readonly REFRESH_TOKEN_SECRET =
    process.env.REFRESH_TOKEN_SECRET ?? "REFRESH_TOKEN_SECRET";
  private readonly ACCESS_TOKEN_EXPIRY = (process.env.ACCESS_TOKEN_EXPIRY ??
    "1d") as StringValue;

  private readonly REFRESH_TOKEN_EXPIRY = (process.env.REFRESH_TOKEN_EXPIRY ??
    "7d") as StringValue;
  constructor(private userRepository: Repository<User>) {}

  /**
   * Generates both Access and Refresh tokens
   */
  public generateTokens(user: User) {
    const payload: TokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    const ACCESS_TOKEN_EXPIRY_OPTIONS: SignOptions = {
      expiresIn: this.ACCESS_TOKEN_EXPIRY || "1d",
    };
    const accessToken = jwt.sign(
      payload,
      this.ACCESS_TOKEN_SECRET,
      ACCESS_TOKEN_EXPIRY_OPTIONS
    );
    const refreshToken = jwt.sign(payload, this.REFRESH_TOKEN_SECRET, {
      expiresIn: this.REFRESH_TOKEN_EXPIRY,
    });

    return { accessToken, refreshToken };
  }

  /**
   * Signs a user in by validating credentials and updating their refresh token
   */
  async signIn(email: string, plainPassword: string) {
    const user = await this.userRepository
      .createQueryBuilder("user")
      .addSelect("user.password")
      .where("user.email = :email", { email })
      .getOne();

    if (!user) {
      throw new ApiError(404, "User does not exist");
    }

    if (user.status !== Status.ACTIVE) {
      throw new ApiError(
        403,
        "Your account is currently inactive. Please contact support to reactivate your access."
      );
    }

    // 2. Securely verify the password hash using Bcrypt
    const isPasswordValid = await bcrypt.compare(plainPassword, user.password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid credentials");
    }

    // 3. Issue new tokens
    const tokens = this.generateTokens(user);

    // 4. Persist the refresh token to the database for session security
    user.refreshToken = tokens.refreshToken;
    await this.userRepository.save(user);
    const { password, refreshToken, ...finalUser } = user;
    return {
      user: finalUser,
      ...tokens,
    };
  }

  /**
   * Signs a user out by wiping their active refresh token from the database
   */
  async signOut(id: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: id });
    if (user) {
      user.refreshToken = "";
      await this.userRepository.save(user);
    }
  }
}
