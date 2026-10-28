import { UserTableCard } from "@/components/pages/UserTableCard";
import { TransactionChart } from "@/components/pages/TransactionChart";
import { MetricsGrid } from "./MetricsGrid";

export const Dashboard = () => {
  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <MetricsGrid />
      <TransactionChart />
      <UserTableCard />
    </div>
  );
};
