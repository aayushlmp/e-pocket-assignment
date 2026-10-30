import { lazy, Suspense } from "react";
import { TransactionStatusDistributionChart } from "@/components/pages/TransactionStatusDistributionChart";
import { TransactionByCurrencyChart } from "./TransactionByCurrencyChart";
const UserTableCard = lazy(() => import('@/components/pages/UserTableCard'));
const MetricsGrid = lazy(() => import('@/components/pages/MetricsGrid').then(c => ({default: c.MetricsGrid})));

export const Dashboard = () => {
  return (
    <Suspense fallback={<div>Loading elements...</div>}>
        {/* Top metrics metrics block */}
        <MetricsGrid />
        
        <div className="flex flex-wrap gap-6 w-full">
          <TransactionStatusDistributionChart />
          <TransactionByCurrencyChart />
        </div>
        
        <UserTableCard />
      </Suspense>
  );
};
