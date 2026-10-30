
import { useMemo, useState } from "react";
import {
  Search,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  MoreHorizontal,
  ArrowUpDown,
  X,
} from "lucide-react";

type Status = "Active" | "Inactive" | "Pending";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  status: Status;
  joined: string;
};

type SortKey = keyof Pick<
  User,
  "name" | "email" | "role" | "department" | "status" | "joined"
>;

const dummyUsers: User[] = [
  { id: 1, name: "Olivia Martin", email: "olivia@example.com", role: "Admin", department: "Engineering", status: "Active", joined: "2026-01-12" },
  { id: 2, name: "Jackson Lee", email: "jackson@example.com", role: "Developer", department: "Engineering", status: "Active", joined: "2026-02-08" },
  { id: 3, name: "Isabella Nguyen", email: "isabella@example.com", role: "Designer", department: "Design", status: "Pending", joined: "2026-03-15" },
  { id: 4, name: "William Kim", email: "william@example.com", role: "Manager", department: "Marketing", status: "Inactive", joined: "2025-12-20" },
  { id: 5, name: "Sophia Patel", email: "sophia@example.com", role: "Developer", department: "Engineering", status: "Active", joined: "2026-04-01" },
  { id: 6, name: "James Wilson", email: "james@example.com", role: "Analyst", department: "Finance", status: "Pending", joined: "2026-02-22" },
  { id: 7, name: "Ava Thompson", email: "ava@example.com", role: "Designer", department: "Design", status: "Active", joined: "2026-03-02" },
  { id: 8, name: "Noah Garcia", email: "noah@example.com", role: "Manager", department: "Sales", status: "Inactive", joined: "2025-11-14" },
  { id: 9, name: "Mia Robinson", email: "mia@example.com", role: "Developer", department: "Engineering", status: "Active", joined: "2026-05-10" },
  { id: 10, name: "Ethan Clark", email: "ethan@example.com", role: "Analyst", department: "Finance", status: "Pending", joined: "2026-04-18" },
  { id: 11, name: "Charlotte Lewis", email: "charlotte@example.com", role: "Admin", department: "Operations", status: "Active", joined: "2026-01-25" },
  { id: 12, name: "Benjamin Hall", email: "benjamin@example.com", role: "Developer", department: "Engineering", status: "Inactive", joined: "2025-10-30" },
  { id: 13, name: "Amelia Young", email: "amelia@example.com", role: "Designer", department: "Design", status: "Active", joined: "2026-06-03" },
  { id: 14, name: "Lucas Allen", email: "lucas@example.com", role: "Manager", department: "Sales", status: "Pending", joined: "2026-05-17" },
  { id: 15, name: "Harper Wright", email: "harper@example.com", role: "Analyst", department: "Finance", status: "Active", joined: "2026-03-29" },
  { id: 16, name: "Daniel Scott", email: "daniel@example.com", role: "Developer", department: "Engineering", status: "Active", joined: "2026-06-11" },
  { id: 17, name: "Evelyn Green", email: "evelyn@example.com", role: "Admin", department: "Operations", status: "Inactive", joined: "2025-09-05" },
  { id: 18, name: "Henry Baker", email: "henry@example.com", role: "Designer", department: "Design", status: "Pending", joined: "2026-07-01" },
];

const statusStyles: Record<Status, string> = {
  Active: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Inactive: "bg-slate-100 text-slate-600 ring-slate-500/20",
  Pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
}

export const DataTable = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return dummyUsers
      .filter((user) => {
        const matchesSearch = [
          user.name,
          user.email,
          user.role,
          user.department,
          user.status,
        ].some((value) => value.toLowerCase().includes(query));

        const matchesStatus =
          statusFilter === "All" || user.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const left = a[sortKey];
        const right = b[sortKey];

        const comparison =
          sortKey === "joined"
            ? new Date(left).getTime() - new Date(right).getTime()
            : String(left).localeCompare(String(right), undefined, {
                numeric: true,
                sensitivity: "base",
              });

        return sortDirection === "asc" ? comparison : -comparison;
      });
  }, [search, statusFilter, sortKey, sortDirection]);

  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const safePage = Math.min(page, Math.max(1, totalPages));

  const paginatedUsers = filteredUsers.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  function changeSort(key: SortKey) {
    if (sortKey === key) {
      setSortDirection((current) => current === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
    setPage(1);
  }

  function resetFilters() {
    setSearch("");
    setStatusFilter("All");
    setPage(1);
  }

  function renderSortIcon(key: SortKey) {
    if (sortKey !== key) {
      return <ChevronsUpDown size={14} className="text-slate-400" />;
    }

    return sortDirection === "asc"
      ? <ChevronUp size={15} className="text-indigo-600" />
      : <ChevronDown size={15} className="text-indigo-600" />;
  }

  const columns: { label: string; key: SortKey }[] = [
    { label: "Name", key: "name" },
    { label: "Role", key: "role" },
    { label: "Department", key: "department" },
    { label: "Status", key: "status" },
    { label: "Joined date", key: "joined" },
  ];

  return (
    <div>
      {/* Table container */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

          {/* Toolbar */}
          <div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                All members
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                View, search, and manage your team.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
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
                  placeholder="Search members..."
                  aria-label="Search members"
                  className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:w-64"
                />
              </div>

              <div className="relative">
                <SlidersHorizontal
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <select
                  value={statusFilter}
                  onChange={(event) => {
                    setStatusFilter(event.target.value);
                    setPage(1);
                  }}
                  aria-label="Filter by status"
                  className="w-full appearance-none rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-8 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:w-44"
                >
                  <option value="All">All statuses</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              {(search || statusFilter !== "All") && (
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
                {filteredUsers.length === 0 ? 0 : (safePage - 1) * pageSize + 1}
                {"–"}
                {Math.min(safePage * pageSize, filteredUsers.length)}
              </span>
              {" "}of{" "}
              <span className="font-semibold text-slate-800">
                {filteredUsers.length}
              </span>{" "}
              members
            </p>

            <div className="inline-flex items-center gap-1.5 text-xs text-slate-500">
              <ArrowUpDown size={13} />
              Click a column to sort
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] border-collapse text-left">
              <thead className="bg-slate-50">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      scope="col"
                      aria-sort={
                        sortKey === column.key
                          ? sortDirection === "asc"
                            ? "ascending"
                            : "descending"
                          : "none"
                      }
                      className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500"
                    >
                      <button
                        type="button"
                        onClick={() => changeSort(column.key)}
                        className="inline-flex items-center gap-1.5 rounded outline-none transition hover:text-indigo-600 focus-visible:ring-2 focus-visible:ring-indigo-500"
                      >
                        {column.label}
                        {renderSortIcon(column.key)}
                      </button>
                    </th>
                  ))}
                  <th scope="col" className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {paginatedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="transition-colors hover:bg-slate-50/80"
                  >
                    {/* User */}
                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-semibold text-indigo-700 ring-1 ring-indigo-100">
                          {getInitials(user.name)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {user.name}
                          </p>
                          <p className="mt-0.5 text-sm text-slate-500">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                      {user.role}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                      {user.department}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusStyles[user.status]}`}
                      >
                        <span className="size-1.5 rounded-full bg-current" />
                        {user.status}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                      {new Date(user.joined + "T00:00:00").toLocaleDateString(
                        "en-US",
                        { month: "short", day: "2-digit", year: "numeric" }
                      )}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-right">
                      <button
                        type="button"
                        aria-label={`More actions for ${user.name}`}
                        title="More actions"
                        onClick={() => alert(`Actions for ${user.name}`)}
                        className="inline-flex size-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <MoreHorizontal size={19} />
                      </button>
                    </td>
                  </tr>
                ))}

                {paginatedUsers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-16 text-center">
                      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                        <Search size={21} />
                      </div>
                      <p className="mt-3 text-sm font-semibold text-slate-900">
                        No members found
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Try a different search term or status filter.
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
                aria-label="Rows per page"
                className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
              </select>
              <span className="hidden sm:inline">per page</span>
            </div>

            <div className="flex items-center justify-between gap-3 sm:justify-end">
              <p className="text-sm text-slate-500">
                Page{" "}
                <span className="font-medium text-slate-800">
                  {filteredUsers.length === 0 ? 0 : safePage}
                </span>
                {" "}of{" "}
                <span className="font-medium text-slate-800">
                  {totalPages}
                </span>
              </p>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={safePage <= 1}
                  aria-label="Previous page"
                  className="inline-flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={17} />
                </button>

                {Array.from({ length: totalPages }, (_, index) => index + 1)
                  .filter((pageNumber) =>
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    Math.abs(pageNumber - safePage) <= 1
                  )
                  .reduce<(number | "...")[]>((result, pageNumber, index, pages) => {
                    if (index > 0 && pageNumber - pages[index - 1] > 1) {
                      result.push("...");
                    }
                    result.push(pageNumber);
                    return result;
                  }, [])
                  .map((pageNumber, index) =>
                    pageNumber === "..." ? (
                      <span
                        key={`ellipsis-${index}`}
                        className="px-1 text-sm text-slate-400"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={pageNumber}
                        type="button"
                        onClick={() => setPage(pageNumber)}
                        aria-label={`Page ${pageNumber}`}
                        aria-current={safePage === pageNumber ? "page" : undefined}
                        className={`inline-flex size-9 items-center justify-center rounded-lg text-sm font-medium transition ${
                          safePage === pageNumber
                            ? "bg-indigo-600 text-white shadow-sm"
                            : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    )
                  )}

                <button
                  type="button"
                  onClick={() =>
                    setPage((current) => Math.min(totalPages, current + 1))
                  }
                  disabled={safePage >= totalPages}
                  aria-label="Next page"
                  className="inline-flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}