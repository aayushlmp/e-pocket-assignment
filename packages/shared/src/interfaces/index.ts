import {
  UserRole,
  Status,
  TransactionStatus,
} from "@e-pocket-assignment/shared/enums";

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  status: Status;
  role: UserRole;
  password?: string;
  avatar?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
export interface LoginDto {
  email: string;
  password: string;
}
export interface LoginResponseDto extends IUser {
  accessToken: string;
  refreshToken: string;
}
export interface CreateUserDto {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
}

export interface UpdateUserDto extends Partial<CreateUserDto> {}

export interface INote {
  id: string;
  comment: string;
  userId: string;
  transactionId: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface TransactionStausHistory {
  id?: string;
  updatedBy: string;
  transactionId: string;
  status: TransactionStatus;
  lastStatus?: TransactionStatus;
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
  status: TransactionStatus;
  createdAt?: Date;
  updatedAt?: Date;
  notes?: INote[];
}
export interface QueryParamOption {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  order?: "ASC" | "DESC";
  status?: TransactionStatus;
}
