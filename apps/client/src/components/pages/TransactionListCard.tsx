import { DataTable } from "@/components/pages/DataTable";
import type { DataTableColumn } from "@/interfaces";
import { fetchTransactions } from "@/services/transaction.service";
import { TransactionStatus } from "@e-pocket-assignment/shared/enums";
import type { ITransaction } from "@e-pocket-assignment/shared/interfaces";
import { MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";

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
      render: (_, transaction) => (transaction.amount),
    },
    {
      key: "exchangeRate",
      label: "Exchange Rate",
      render: (_, transaction) => (transaction.exchangeRate),
    },
    {
      key: "fees",
      label: "Fees",
      render: (_, transaction) => (transaction.fees),
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
              : value === TransactionStatus.FAILED ? "bg-red-50 text-red-700" : 'bg-warning text-red-700'
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
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const response = await fetchTransactions();
        if (response) {
          setTransactions(response.data.data.transactions);
        }
      } catch (error) {
        console.error("Failed to load users", error);
      }
    };
    loadTransactions();
  }, []);
  return (
    <DataTable
      data={transactions}
      columns={columns}
      rowKey="id"
      title="All Transaction"
      description="View, search, and manage your transactions."
      searchPlaceholder="Search members..."
      filter={{
        key: "status",
        label: "Status",
        options: [
          { label: "Approved", value: TransactionStatus.APPROVED },
          { label: "Pending", value: TransactionStatus.PENDING },
          { label: "Failed", value: TransactionStatus.FAILED },
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
export default TransactionListCard;
