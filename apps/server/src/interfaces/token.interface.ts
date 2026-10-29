import { UserRole } from "@e-pocket-assignment/shared/enums";
import { IUser } from "@e-pocket-assignment/shared/interfaces";
import { Request } from "express";

export interface TokenPayload {
  id: string;
  email: string;
  role: UserRole;
}
export interface AuthenticatedRequest extends Request {
  user?: Partial<IUser>;
}
