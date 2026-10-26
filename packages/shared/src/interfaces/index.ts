import { UserRole, Status } from '@e-pocket-assignment/shared/enums';

export interface User {
    id: string;
    first_name: string;
    last_name: string;
    user_name: string;
    email: string;
    status: Status;
    role: UserRole
    created_at: Date,
    updated_at: Date,
}