import { ObjectLiteral } from "typeorm";
import { QueryParamOption } from "@e-pocket-assignment/shared/interfaces";

export type SortOrder = "ASC" | "DESC";

/**
 * Generic query parameters accepted by PaginationService.
 * Reuses the existing shared `QueryParamOption` (page, limit, search, sortBy,
 * order, status) and allows additional entity-specific filter/range params
 * (e.g. role, minAmount, maxCreatedAt) passed through as unknown values.
 */
export interface PaginationQuery extends QueryParamOption {
  [key: string]: unknown;
}

/**
 * Entity-specific configuration for PaginationService.
 * Every dynamic column name is developer-provided and allowlisted here,
 * so user input can never introduce arbitrary column names into SQL.
 */
export interface QueryOptions<T extends ObjectLiteral> {
  /** QueryBuilder alias, e.g. "transaction" */
  alias: string;
  /** Fields used for partial (LIKE) matching against `search` */
  searchableFields?: readonly Extract<keyof T, string>[];
  /** Fields that support exact-match / IN filtering */
  filterableFields?: readonly Extract<keyof T, string>[];
  /** Fields that support `min<Field>` / `max<Field>` range filtering */
  rangeFields?: readonly Extract<keyof T, string>[];
  /** Allowlist of fields that `sortBy` may target */
  sortableFields?: readonly Extract<keyof T, string>[];
  /** Used when `sortBy` is missing or not allowlisted (defaults to "createdAt") */
  defaultSortBy?: Extract<keyof T, string>;
  /** Used when `order` is missing or not ASC (defaults to "DESC") */
  defaultOrder?: SortOrder;
  /** Page size used when `limit` is missing (defaults to 10) */
  defaultLimit?: number;
  /** Upper bound for `limit`, capped at 100 (defaults to 100) */
  maxLimit?: number;
}

export interface PaginationMeta {
  total: number;
  itemCount: number;
  limit: number;
  totalPages: number;
  currentPage: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: PaginationMeta;
}
