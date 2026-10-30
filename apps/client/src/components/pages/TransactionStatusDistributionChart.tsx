import { CardWrapper } from "@/components/pages/CardWrapper";
import { PieChartWrapper } from "@/components/pages/PieChartWrapper";
import type { StatusDistributionChart } from "@/interfaces";
import { fetchStatusDistribution } from "@/services/chart.service";
import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import type { ChartConfig } from "@/components/ui/chart";
export const TransactionStatusDistributionChart = () => {
  const card = {
    title: `Transaction Status Distribution`,
    icon: TrendingUp,
    footer: "Illustrative distribution of transaction statuses.",
  };
  const chartConfig = {
    pending: {
      label: "Pending",
      color: "#cdbf37", // Warning Color (Tailwind Amber-500)
    },
    failed: {
      label: "Failed",
      color: "#f06a6a", // Deep Red (Tailwind Red-600)
    },
    approved: {
      label: "Approved",
      color: "#7fba91", // Vibrant Green (Tailwind Green-600)
    },
  } satisfies ChartConfig;
  const [chartData, setChartData] = useState<StatusDistributionChart[]>([]);
  useEffect(() => {
    const loadChart = async () => {
      try {
        const response = await fetchStatusDistribution();
        const data = response.data.data?.map((item: StatusDistributionChart) => {
          const normalizedStatus = (item.status || "").toLowerCase();
          return {
            ...item,
            status: normalizedStatus,
            fill: chartConfig[normalizedStatus as keyof typeof chartConfig]?.color,
          };
        });
        setChartData(data);
      } catch (error) {
        console.error("Failed to load transaction volume", error);
      }
    };

    loadChart();
  }, []);
  return (
    <CardWrapper
      className="w-full h-full md:flex-1 md:min-w-[max(320px,calc(50%-12px))] lg:min-w-[max(320px,calc(50%-16px))] max-w-full"
      key={card.title}
      title={card.title}
      description={<></>}
      action={<></>}
      footer={
        <div className="text-muted-foreground">
          {<i className="text-xs">{card.footer}</i>}
        </div>
      }
    >
      <div className="w-full h-full">
        <PieChartWrapper chartData={chartData} chartConfig={chartConfig} dataKey="count" labelKey="status"/>
      </div>
    </CardWrapper>
  );
};
