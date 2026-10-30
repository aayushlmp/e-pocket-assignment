import { CardWrapper } from "@/components/pages/CardWrapper";
import { LineChartWrapper } from "@/components/pages/LineChartWrapper";
import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import type { ChartConfig } from "../ui/chart";
import { fetchTransactionVolume } from "@/services/chart.service";
import type { TransactionValumeChart } from "@/interfaces";
export const TransactionVolumeChart = () => {
  const card = {
    title: `Daily Transaction Volume`,
    icon: TrendingUp,
    footer: "Illustrative transaction counts over seven days.",
  };
  const chartConfig = {
    date: {
      label: "Date",
      color: "#cdbf37", // Warning Color (Tailwind Amber-500)
    },
  } satisfies ChartConfig;
  const [chartData, setChartData] = useState<TransactionValumeChart[]>([]);
  useEffect(() => {
    const loadChart = async () => {
      try {
        const response = await fetchTransactionVolume('90d');
        console.log(response)
        const data = response.data.data?.map(
          (item: TransactionValumeChart) => {
            const normalizedStatus = (item.date || "").toLowerCase();
            return {
              ...item,
              status: normalizedStatus,
              fill: chartConfig[normalizedStatus as keyof typeof chartConfig]
                ?.color,
            };
          },
        );
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
        <LineChartWrapper chartData={chartData} chartConfig={chartConfig} xAxisKey={"date"} lineKey={"date"} />
      </div>
    </CardWrapper>
  );
};
