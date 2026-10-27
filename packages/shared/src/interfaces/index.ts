import { UserRole, Status, TransactionStatus } from '@e-pocket-assignment/shared/enums';

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

export interface Note {
    id: string;
    comment: string;
    userId: string;
    transactionId: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface ITransaction {
    id?: string;
    customerId: string;
    customerName: string;
    sourceCurrencyCode: string;
    targetCurrencyCode: string;
    amount: number;
    exchangeRate: number;
    fees: number;
    status: TransactionStatus
    createdAt?: Date;
    updatedAt?: Date;
    notes?: Note[];
}
export interface QueryParamOption {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  order?: 'ASC' | 'DESC';
  status?: TransactionStatus;
}
