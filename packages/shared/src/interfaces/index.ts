import { UserRole, Status } from '@e-pocket-assignment/shared/enums';

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    status: Status;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}
