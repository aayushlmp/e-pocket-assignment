import { lazy, Suspense } from "react";
import { TransactionStatusDistributionChart } from "@/components/pages/charts/TransactionStatusDistributionChart";
import { TransactionByCurrencyChart } from "@/components/pages/charts/TransactionByCurrencyChart";
import { DashboardSkeleton } from "@/components/pages/dashboards/DashboardSkelton";
const UserTableCard = lazy(() => import('@/components/pages/cards/UserTableCard'));
const MetricsGrid = lazy(() => import('@/components/pages/cards/MetricsGrid').then(c => ({default: c.MetricsGrid})));

export const Dashboard = () => {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
        {/* Top metrics metrics block */}
        <MetricsGrid />
        
        <div className="flex flex-wrap items-start gap-6 w-full">
          <TransactionStatusDistributionChart />
          <TransactionByCurrencyChart />
        </div>
        
        <div className="mt-6 w-full">
        <UserTableCard />
        </div>
      </Suspense>
  );
};
