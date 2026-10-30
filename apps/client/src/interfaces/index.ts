import type { ChartConfig } from "@/components/ui/chart";
import type {
  IUser,
  LoginResponseDto,
} from "@e-pocket-assignment/shared/interfaces";
import type { ReactNode } from "react";

export type environment = "dev" | "staging" | "prod";
export interface CardWrapperProps {
  /** The main dynamic component, form, chart, or layout inside the card */
  children?: React.ReactNode;
  /** Main heading title string */
  title: React.ReactNode | string;
  /** Sub-heading descriptive text */
  description?: React.ReactNode | string;
  /** Optional content layout badge */
  badge?: React.ReactNode;
  /** Optional secondary component or button to render in the top right corner */
  action?: React.ReactNode;
  /** Optional content layout or action buttons inside the bottom footer */
  footer?: React.ReactNode;
  /** Additional Tailwind styling overrides for the card shell container */
  className?: string;
}
export interface AppConfig {
  API_BASE_URL: string;
  APP_VERSION: string;
  APP_ENV: environment;
  ENABLE_ANALYTICS?: boolean;
}
export interface AuthContextType {
  user: IUser | null;
  isAuthenticated: boolean;
  signInSuccessHandler: (user: LoginResponseDto) => void;
  signOutSuccessHandler: () => void;
}

export interface DashboardTransactionMetric {
  total: number;
  totalAmount: number;
  pending: number;
  completed: number;
}
export interface CurrencyChart {
  currency: string;
  transactionCount: number;
  totalAmount: number;
  totalFees: number;
}
export interface StatusDistributionChart {
  status: string;
  count: number;
}
export interface TransactionValumeChart {
  date: string;
  count: number;
}
export interface ChartWrapperProps<T> {
  chartData: T[];
  chartConfig: ChartConfig;
}
export interface PieChartWrapperProps<T> extends ChartWrapperProps<T> {
  dataKey: Extract<keyof T, string>;
  labelKey: Extract<keyof T, string>;
}

// 📈 Dedicated Line interface layout definitions
export interface BarChartWrapperProps<T> extends ChartWrapperProps<T> {
  xAxisKey: string;
  yAxisKeys: string[];
}

export interface DataTableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  searchable?: boolean;
  className?: string;

  // Custom cell rendering
  render?: (value: T[keyof T], row: T) => ReactNode;

  // Optional custom sorting value
  sortValue?: (row: T) => string | number;
}

export interface DataTableFilter<T> {
  key: keyof T;
  label: string;
  options: {
    label: string;
    value: string;
  }[];
}

export type DataTableSortDirection = "asc" | "desc";

/** Query params the DataTable sends to the API in server-driven mode */
export interface DataTableQueryParams {
  page: number;
  limit: number;
  search: string;
  sortBy: string | null;
  order: DataTableSortDirection;
  filterValue: string | null;
}

/** Normalized result a server-driven DataTable expects back */
export interface DataTableFetchResult<T> {
  data: T[];
  total: number;
}

export type DataTableFetchFn<T> = (
  params: DataTableQueryParams
) => Promise<DataTableFetchResult<T>>;

/**
 * Updates a matching row in place (server-driven mode) without refetching.
 * Example: after a status change, patch the row locally.
 */
export type DataTableRowUpdater<T> = (
  match: (row: T) => boolean,
  patch: Partial<T>
) => void;

/** Query params accepted by the paginated list endpoints (PaginationService) */
export interface ApiListQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  order?: "ASC" | "DESC";
  [key: string]: string | number | undefined;
}

export interface DataTableProps<T extends Record<string, any>> {
  /** Local mode: rows to paginate/sort/filter in memory */
  data?: T[];
  /**
   * Server-driven mode: when provided, search/filter/sort/pagination are
   * delegated to the API (PaginationService) via this callback instead of
   * being applied locally over `data`.
   */
  fetchData?: DataTableFetchFn<T>;
  /**
   * Receives a function that updates a matching row in place (server-driven
   * mode) without an extra GET — e.g. after a successful mutation.
   */
  registerRowUpdater?: (updater: DataTableRowUpdater<T>) => void;
  columns: DataTableColumn<T>[];

  title?: string;
  description?: string;
  searchPlaceholder?: string;

  searchable?: boolean;
  filter?: DataTableFilter<T>;

  pageSize?: number;
  pageSizeOptions?: number[];

  rowKey: keyof T;

  actions?: (row: T) => ReactNode;

  emptyMessage?: string;
}
