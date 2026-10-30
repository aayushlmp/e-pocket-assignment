import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeftRight,
  CheckCircle,
  Clock,
  TrendingUp,
} from "lucide-react";

import { CardWrapper } from "@/components/pages/CardWrapper";
import {
  fetchTotalTransactions,
  fetchTotalTransferAmount,
  fetchPendingTransactions,
  fetchCompletedTransactions,
} from "@/services/transaction.service";
import { toast } from "sonner";
import type { DashboardTransactionMetric } from "@/interfaces";

export const MetricsGrid = () => {
  const [metrics, setMetrics] = useState<DashboardTransactionMetric>({
    total: 0,
    totalAmount: 0,
    pending: 0,
    completed: 0,
  });

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const [totalRes, amountRes, pendingRes, completedRes] =
          await Promise.all([
            fetchTotalTransactions(),
            fetchTotalTransferAmount(),
            fetchPendingTransactions(),
            fetchCompletedTransactions(),
          ]);

        setMetrics({
          total: totalRes.data.data.total,
          totalAmount: amountRes.data.data.totalAmount,
          pending: pendingRes.data.data.total,
          completed: completedRes.data.data.total,
        });
      } catch (error) {
        toast.error("Failed to fetch transaction metrics");
      }
    };

    loadMetrics();
  }, []);

  const cards = [
    {
      title: "Total Transactions",
      value: metrics.total.toLocaleString(),
      icon: TrendingUp,
      footer:
        "The total number of transactions recorded across all users, including pending and completed transactions.",
    },
    {
      title: "Total Transfer Amount",
      value: metrics.totalAmount.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
      }),
      icon: ArrowLeftRight,
      footer:
        "The cumulative monetary value of all transactions recorded in the system, regardless of transaction status.",
    },
    {
      title: "Pending Transactions",
      value: metrics.pending.toLocaleString(),
      icon: Clock,
      footer:
        "Transactions that have been initiated but are still awaiting processing, confirmation, or a final status update.",
    },
    {
      title: "Completed Transactions",
      value: metrics.completed.toLocaleString(),
      icon: CheckCircle,
      footer:
        "Transactions that have successfully reached the completed status and are no longer awaiting processing.",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 @5xl/main:grid-cols-4">
      {cards.map(({ title, value, icon: Icon, footer }) => (
        <CardWrapper
          key={title}
          title={title}
          description={
            <div className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              { value}
            </div>
          }
          action={
            <Badge variant="outline" className="rounded p-3">
              <Icon className="size-4" />
            </Badge>
          }
          // footer={<div className="text-muted-foreground">{<i className="text-xs">{footer}</i>}</div>}
        />
      ))}
    </div>
  );
};
