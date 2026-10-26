import { UserRole } from "@e-pocket-assignment/shared/enums";
import { User } from "@e-pocket-assignment/shared/interfaces";
import {Request} from 'express';

export interface TokenPayload {
    id: string;
    email: string;
    role: UserRole;
}
export interface AuthenticatedRequest extends Request {
    user?: User;
}
export interface LoggedInUserResponse {
    accessToken: string;
    refreshToken: string;
    user: User
}