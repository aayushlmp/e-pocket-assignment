
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Search,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  ArrowUpDown,
  X,
} from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import type {
  DataTableProps,
  DataTableRowUpdater,
  DataTableSortDirection,
} from "@/interfaces";
import { toast } from "sonner";

type SortDirection = DataTableSortDirection;

export const DataTable = <T extends Record<string, any>>({
  data = [],
  fetchData,
  registerRowUpdater,
  columns,
  title = "All records",
  description = "View and manage records.",
  searchPlaceholder = "Search...",
  searchable = true,
  filter,
  pageSize: initialPageSize = 10,
  pageSizeOptions = [5, 10, 15, 20, 50],
  rowKey,
  actions,
  emptyMessage = "No records found.",
}: DataTableProps<T>) => {
  const [search, setSearch] = useState("");
  const [filterValue, setFilterValue] = useState("All");
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] =
    useState<SortDirection>("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Server-driven mode state (used when `fetchData` is provided)
  const isServerMode = Boolean(fetchData);
  const [serverRows, setServerRows] = useState<T[]>([]);
  const [serverTotal, setServerTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // In-place row updates (server-driven mode) without an extra GET
  const updateRow = useCallback<DataTableRowUpdater<T>>(
    (match, patch) => {
      setServerRows((rows) =>
        rows.map((row) => (match(row) ? { ...row, ...patch } : row))
      );
    },
    []
  );

  useEffect(() => {
    if (!registerRowUpdater) return;

    registerRowUpdater(updateRow);
  }, [registerRowUpdater, updateRow]);

  // Debounce search before hitting the API
  useEffect(() => {
    if (!isServerMode) return;

    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [search, isServerMode]);

  // Fetch rows from the API whenever query params change
  useEffect(() => {
    if (!fetchData) return;

    let active = true;

    setIsLoading(true);

    fetchData({
      page,
      limit: pageSize,
      search: debouncedSearch,
      sortBy: sortKey ? String(sortKey) : null,
      order: sortDirection,
      filterValue: filterValue === "All" ? null : filterValue,
    })
      .then((result) => {
        if (!active) return;

        setServerRows(result.data);
        setServerTotal(result.total);

        // Guard: current page no longer exists (e.g. results narrowed)
        if (result.data.length === 0 && page > 1) {
          setPage(1);
        }
      })
      .catch((error) => {
        toast.error("Failed to load records", error);
        if (!active) return;

        setServerRows([]);
        setServerTotal(0);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [
    fetchData,
    page,
    pageSize,
    debouncedSearch,
    sortKey,
    sortDirection,
    filterValue,
  ]);

  // Search, filter and sorting
  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase();

    return data
      .filter((row) => {
        const matchesSearch =
          !query ||
          columns
            .filter((column) => column.searchable !== false)
            .some((column) =>
              String(row[column.key] ?? "")
                .toLowerCase()
                .includes(query)
            );

        const matchesFilter =
          !filter ||
          filterValue === "All" ||
          String(row[filter.key]) === filterValue;

        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        if (!sortKey) return 0;

        const column = columns.find(
          (item) => item.key === sortKey
        );

        const left = column?.sortValue
          ? column.sortValue(a)
          : a[sortKey];

        const right = column?.sortValue
          ? column.sortValue(b)
          : b[sortKey];

        let comparison = 0;

        if (typeof left === "number" && typeof right === "number") {
          comparison = left - right;
        } else {
          comparison = String(left ?? "").localeCompare(
            String(right ?? ""),
            undefined,
            { numeric: true, sensitivity: "base" }
          );
        }

        return sortDirection === "asc"
          ? comparison
          : -comparison;
      });
  }, [data, columns, search, filter, filterValue, sortKey, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const safePage = Math.min(page, Math.max(1, totalPages));

  const paginatedData = filteredData.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  // Resolve rows/pagination for the active mode (local vs server-driven)
  const activePage = isServerMode ? page : safePage;
  const pageCount = isServerMode
    ? Math.ceil(serverTotal / pageSize)
    : totalPages;
  const totalRecords = isServerMode ? serverTotal : filteredData.length;
  const visibleRows = isServerMode ? serverRows : paginatedData;

  // Sorting
  const changeSort = (key: keyof T) => {
    const column = columns.find((item) => item.key === key);

    if (column?.sortable === false) return;

    if (sortKey === key) {
      setSortDirection((current) =>
        current === "asc" ? "desc" : "asc"
      );
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }

    setPage(1);
  };

  const resetFilters = () => {
    setSearch("");
    setFilterValue("All");
    setPage(1);
  };

  const renderSortIcon = (key: keyof T) => {
    if (sortKey !== key) {
      return <ChevronsUpDown size={14} className="text-slate-400" />;
    }

    return sortDirection === "asc" ? (
      <ChevronUp size={15} className="text-indigo-600" />
    ) : (
      <ChevronDown size={15} className="text-indigo-600" />
    );
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

      {/* Toolbar */}
      <div className="flex flex-col gap-4 border-b p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            {title}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {description}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          {searchable && (
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder={searchPlaceholder}
                className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:w-64"
              />
            </div>
          )}

          {filter && (
            <div className="relative">
              <SlidersHorizontal
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <select
                value={filterValue}
                onChange={(event) => {
                  setFilterValue(event.target.value);
                  setPage(1);
                }}
                className="w-full appearance-none rounded-lg border border-slate-300 py-2.5 pl-9 pr-8 text-sm outline-none focus:border-indigo-500 sm:w-44"
              >
                <option value="All">All {filter.label}</option>

                {filter.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {(search || filterValue !== "All") && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center justify-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              <X size={15} />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Results summary */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-4 py-3 sm:px-5">
        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-800">
            {totalRecords === 0
              ? 0
              : (activePage - 1) * pageSize + 1}
            {"–"}
            {Math.min(activePage * pageSize, totalRecords)}
          </span>
          {" "}of{" "}
          <span className="font-semibold text-slate-800">
            {totalRecords}
          </span>
          {" "}records
        </p>

        <div className="inline-flex items-center gap-1.5 text-xs text-slate-500">
          <ArrowUpDown size={13} />
          Click a column to sort
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[750px] border-collapse text-left">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  scope="col"
                  aria-sort={
                    sortKey === column.key
                      ? sortDirection === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                  className={`px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 ${column.className ?? ""}`}
                >
                  <button
                    type="button"
                    disabled={column.sortable === false}
                    onClick={() => changeSort(column.key)}
                    className="inline-flex items-center gap-1.5 rounded outline-none transition hover:text-indigo-600 disabled:cursor-default disabled:hover:text-slate-500"
                  >
                    {column.label}
                    {column.sortable !== false &&
                      renderSortIcon(column.key)}
                  </button>
                </th>
              ))}

              {actions && (
                <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {isLoading &&
              visibleRows.length === 0 &&
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={`loading-row-${index}`}>
                  <td
                    colSpan={columns.length + (actions ? 1 : 0)}
                    className="px-5 py-4"
                  >
                    <Skeleton className="h-4 w-full" />
                  </td>
                </tr>
              ))}

            {!isLoading && visibleRows.map((row) => (
              <tr
                key={String(row[rowKey])}
                className="transition-colors hover:bg-slate-50/80"
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className="whitespace-nowrap px-5 py-4 text-sm text-slate-600"
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : String(row[column.key] ?? "—")}
                  </td>
                ))}

                {actions && (
                  <td className="whitespace-nowrap px-5 py-4 text-right">
                    {actions(row)}
                  </td>
                )}
              </tr>
            ))}

            {!isLoading && visibleRows.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-5 py-16 text-center"
                >
                  <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                    <Search size={21} />
                  </div>

                  <p className="mt-3 text-sm font-semibold text-slate-900">
                    {emptyMessage}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Try changing your search or filters.
                  </p>

                  <button
                    type="button"
                    onClick={resetFilters}
                    className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    Clear all filters
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-4 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span>Rows per page</span>

          <select
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              setPage(1);
            }}
            className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <p className="text-sm text-slate-500">
            Page{" "}
            <span className="font-medium text-slate-800">
              {totalRecords === 0 ? 0 : activePage}
            </span>
            {" "}of{" "}
            <span className="font-medium text-slate-800">
              {pageCount}
            </span>
          </p>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() =>
                setPage((current) => Math.max(1, current - 1))
              }
              disabled={activePage <= 1}
              aria-label="Previous page"
              className="inline-flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={17} />
            </button>

            <button
              type="button"
              onClick={() =>
                setPage((current) => Math.min(pageCount, current + 1))
              }
              disabled={activePage >= pageCount}
              aria-label="Next page"
              className="inline-flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
