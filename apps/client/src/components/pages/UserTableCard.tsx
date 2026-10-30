import { DataTable } from "@/components/pages/DataTable";
import type { DataTableColumn, DataTableFetchFn } from "@/interfaces";
import { fetchUsers } from "@/services/user.service";
import { Status } from "@e-pocket-assignment/shared/enums";
import type { IUser } from "@e-pocket-assignment/shared/interfaces";
import { MoreHorizontal } from "lucide-react";
import { useCallback } from "react";

const UserTableCard = () => {
  const columns: DataTableColumn<IUser>[] = [
    {
      key: "userName",
      label: "Name",
      render: (_, user) => (
        <div>
          <p className="font-semibold text-slate-900">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-slate-500">{user.email}</p>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
    },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            value === "Active"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {String(value)}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Joined Date",
      render: (value) => new Date(String(value)).toLocaleDateString("en-US"),
      sortValue: (user) => new Date(user.createdAt).getTime(),
    },
  ];
  const loadUsers = useCallback<DataTableFetchFn<IUser>>(
    async ({ page, limit, search, sortBy, order, filterValue }) => {
      try {
        const response = await fetchUsers({
          page,
          limit,
          search: search || undefined,
          sortBy: sortBy ?? undefined,
          order: order.toUpperCase() as "ASC" | "DESC",
          status: filterValue ?? undefined,
        });
        const { users, pagination } = response.data.data;

        return { data: users, total: pagination.total };
      } catch (error) {
        console.error("Failed to load users", error);
        return { data: [], total: 0 };
      }
    },
    []
  );
  return (
    <DataTable
      fetchData={loadUsers}
      columns={columns}
      rowKey="id"
      title="All Members"
      description="View, search, and manage your team."
      searchPlaceholder="Search members..."
      filter={{
        key: "status",
        label: "Status",
        options: [
          { label: "Active", value: Status.ACTIVE },
          { label: "Inactive", value: Status.INACTIVE },
        ],
      }}
      actions={(user) => (
        <button
          type="button"
          onClick={() => console.log(user)}
          className="rounded-lg p-2 hover:bg-slate-100"
        >
          <MoreHorizontal size={19} />
        </button>
      )}
    />
  );
};
export default UserTableCard;
