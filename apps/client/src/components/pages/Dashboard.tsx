import { lazy, Suspense } from "react";
const UserTableCard = lazy(() => import('@/components/pages/UserTableCard'));
const MetricsGrid = lazy(() => import('@/components/pages/MetricsGrid').then(c => ({default: c.MetricsGrid})));

export const Dashboard = () => {
  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
    <Suspense fallback={<div>Loading elements...</div>}>
      <MetricsGrid />
      <UserTableCard />
    </Suspense>
    </div>
  );
};
