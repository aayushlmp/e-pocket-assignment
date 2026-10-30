import { lazy, Suspense } from "react";
import { TransactionStatusDistributionChart } from "@/components/pages/TransactionStatusDistributionChart";
import { TransactionVolumeChart } from "@/components/pages/TransactionVolumeChart";
import { TransactionByCurrencyChart } from "./TransactionByCurrencyChart";
const UserTableCard = lazy(() => import('@/components/pages/UserTableCard'));
const MetricsGrid = lazy(() => import('@/components/pages/MetricsGrid').then(c => ({default: c.MetricsGrid})));

export const Dashboard = () => {
  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6 w-full">
      <Suspense fallback={<div>Loading elements...</div>}>
        {/* Top metrics metrics block */}
        <MetricsGrid />
        
        <div className="flex flex-wrap gap-6 w-full">
          <TransactionStatusDistributionChart />
          <TransactionByCurrencyChart />
        </div>
        
        <UserTableCard />
      </Suspense>
    </div>
  );
};
