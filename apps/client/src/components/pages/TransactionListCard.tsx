import { DataTable } from "@/components/pages/DataTable";
import type {
  DataTableColumn,
  DataTableFetchFn,
  DataTableRowUpdater,
} from "@/interfaces";
import {
  fetchTransactions,
  updateTransactionStatus,
  deleteTransaction,
} from "@/services/transaction.service";
import { ConfirmDialog } from "@/components/pages/ConfirmDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TransactionStatus } from "@e-pocket-assignment/shared/enums";
import { Permission } from "@e-pocket-assignment/shared/constants";
import type { ITransaction } from "@e-pocket-assignment/shared/interfaces";
import {
  CircleX,
  NotebookPen,
  SquareChevronsDown,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { Can } from "@/components/common/Can";
import {AddTransactionNote} from '@/components/pages/AddTransactionNote';

const TransactionListCard = () => {
  const columns: DataTableColumn<ITransaction>[] = [
    {
      key: "customerName",
      label: "Customer Name",
      render: (_, transaction) => (
        <div>
          <p className="font-semibold text-slate-900">
            {transaction.customerName}
          </p>
        </div>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      render: (_, transaction) => transaction.amount,
    },
    {
      key: "exchangeRate",
      label: "Exchange Rate",
      render: (_, transaction) => transaction.exchangeRate,
    },
    {
      key: "fees",
      label: "Fees",
      render: (_, transaction) => transaction.fees,
    },
    {
      key: "sourceCurrencyCode",
      label: "Source Currency",
    },
    {
      key: "targetCurrencyCode",
      label: "Target Currency",
    },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            value === TransactionStatus.APPROVED
              ? "bg-emerald-50 text-emerald-700"
              : value === TransactionStatus.FAILED
                ? "bg-red-50 text-red-700"
                : "bg-warning text-red-700"
          }`}
        >
          {String(value)}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Transaction Date",
      render: (value) => new Date(String(value)).toLocaleDateString("en-US"),
      // sortValue: (transaction) => new Date(transaction.createdAt).getTime(),
    },
  ];
  const transactions = useCallback<DataTableFetchFn<ITransaction>>(
    async ({ page, limit, search, sortBy, order, filterValue }) => {
      try {
        const response = await fetchTransactions({
          page,
          limit,
          search: search || undefined,
          sortBy: sortBy ?? undefined,
          order: order.toUpperCase() as "ASC" | "DESC",
          status: filterValue ?? undefined,
        });
        const { transactions, pagination } = response.data.data;

        return { data: transactions, total: pagination.total };
      } catch (error) {
        console.error("Failed to load transactions", error);
        return { data: [], total: 0 };
      }
    },
    [],
  );
  // Registered with DataTable so a successful update can patch the row
  // in place without triggering another GET.
  const rowUpdaterRef = useRef<DataTableRowUpdater<ITransaction> | null>(null);
  const registerRowUpdater = useCallback(
    (updater: DataTableRowUpdater<ITransaction>) => {
      rowUpdaterRef.current = updater;
    },
    [],
  );

  const changeStatus = useCallback(
    async (transaction: Partial<ITransaction>, status: TransactionStatus) => {
      if (!transaction.id) return;
      if (transaction.status === status) return;
      try {
        const response = await updateTransactionStatus(transaction.id, status);
        toast.success(
          response.data.message || "Transaction status updated successfully",
        );
        // Update the row locally — no refetch needed
        rowUpdaterRef.current?.((row) => row.id === transaction.id, { status });
      } catch (error: any) {
        toast.error(error?.message || "Failed to update transaction status");
      }
    },
    [],
  );

  // Confirm delete dialog state
  const [isOpenDeleteConfirmDialog, setIsOpenDeleteConfirmDialog] = useState<boolean>(false);
  const [isOpenAddNoteDialog, setIsOpenAddNoteDialog] = useState<boolean>(false);
  const [deleteRowId, setDeleteRowId] = useState<
    string | null
  >(null);
  const [addNoteRowId, setAddNoteRowId] = useState<
    string | null
  >(null);

  const openConfirmDialog = useCallback((id: string) => {
    setDeleteRowId(id);
    setIsOpenDeleteConfirmDialog(true);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!deleteRowId) return;
    try {
      const response = await deleteTransaction(deleteRowId);
      toast.success(
        response.data.message || "Transaction deleted successfully",
      );
      // Remove the row locally — no refetch needed
      rowUpdaterRef.current?.((row) => row.id !== deleteRowId);
      setIsOpenDeleteConfirmDialog(false);
      setDeleteRowId(null);
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete transaction");
    }
  }, [deleteRowId]);

  return (
    <>
    <DataTable
      fetchData={transactions}
      registerRowUpdater={registerRowUpdater}
      columns={columns}
      rowKey="id"
      title="All Transactions"
      description="View, search, and manage your transactions."
      searchPlaceholder="Search for transactions..."
      filter={{
        key: "status",
        label: "Status",
        options: [
          { label: "Approved", value: TransactionStatus.APPROVED },
          { label: "Pending", value: TransactionStatus.PENDING },
          { label: "Failed", value: TransactionStatus.FAILED },
        ],
      }}
      actions={(transaction: ITransaction) => (
        <div className="flex items-center justify-end gap-1">
          {/* Edit / Add Note button */}
          <Can permission={Permission.TRANSACTION_ADD_NOTE}>
            <button
              type="button"
              aria-label="Add Note"
              title="Add Note"
              onClick={() => {
                setAddNoteRowId((transaction?.id as string) || '')
                setIsOpenAddNoteDialog(true);
              }}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 cursor-pointer"
            >
              <NotebookPen size={17} />
            </button>
          </Can>

          {/* Delete button */}
          <Can permission={Permission.TRANSACTION_DELETE}>
            <button
              type="button"
              aria-label="Delete transaction"
              title="Delete"
              onClick={() => openConfirmDialog((transaction?.id as string) || '')}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 cursor-pointer"
            >
              <CircleX size={17} />
            </button>
          </Can>

          {/* Status dropdown */}
          <Can permission={Permission.USER_CHANGE_STATUS}>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    type="button"
                    aria-label="Change transaction status"
                    title="Change status"
                    className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-indigo-600"
                  >
                    <SquareChevronsDown size={17} />
                  </button>
                }
              />

              <DropdownMenuContent
                align="end"
                side="bottom"
                className="min-w-36 rounded-lg"
              >
                <DropdownMenuRadioGroup
                  value={transaction.status}
                  onValueChange={(status) =>
                    changeStatus(
                      { id: transaction.id, status: transaction.status },
                      status as TransactionStatus,
                    )
                  }
                >
                  <DropdownMenuLabel>Status</DropdownMenuLabel>

                  <DropdownMenuRadioItem value={TransactionStatus.APPROVED}>
                    Approved
                  </DropdownMenuRadioItem>

                  <DropdownMenuRadioItem value={TransactionStatus.PENDING}>
                    Pending
                  </DropdownMenuRadioItem>

                  <DropdownMenuRadioItem value={TransactionStatus.FAILED}>
                    Failed
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </Can>
        </div>
      )}
    />
    <ConfirmDialog
      open={isOpenDeleteConfirmDialog}
      onClose={setIsOpenDeleteConfirmDialog}
      title="Delete transaction"
      description="Are you sure you want to delete this transaction?"
      onConfirm={handleDelete}
      destructive={false}
    />
    <AddTransactionNote open={isOpenAddNoteDialog} onClose={setIsOpenAddNoteDialog} transactionId={addNoteRowId}/>
    </>
  );
};
export default TransactionListCard;
