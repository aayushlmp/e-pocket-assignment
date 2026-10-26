import { UserRole } from "@e-pocket-assignment/shared/enums";

export interface TokenPayload {
    id: string;
    email: string;
    role: UserRole;
}