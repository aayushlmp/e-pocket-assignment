import { CardWrapper } from "@/components/pages/CardWrapper";
import { BarChartWrapper } from "@/components/pages/BarChartWrapper";
import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import type { ChartConfig } from "@/components/ui/chart";
import { fetchCurrencyBreakdown } from "@/services/chart.service";
import type { CurrencyChart } from "@/interfaces";

export const TransactionByCurrencyChart = () => {
  const card = {
    title: `Transaction Amount by Currency`,
    icon: TrendingUp,
    footer:
      "Illustrative amounts grouped by source currency; currencies are not converted to a common base.",
  };

  const chartConfig = {
    currency: {
      label: "Currency",
      color: "#cdbf37",
    },
    transactionCount: {
      label: "Total Transactions",
      color: "#f06a6a",
    },
    totalAmount: {
      label: "Total Amount",
      color: "#7fba91",
    },
    totalFees: {
      label: "Total Fees",
      color: "#7b91ba",
    },
  } satisfies ChartConfig;
  const yAxisId = ['transactionCount', 'totalAmount', 'totalFees'];
  const xAxisId = 'currency';
  const [chartData, setChartData] = useState<CurrencyChart[]>([]);
  useEffect(() => {
    const loadChart = async () => {
      try {
        const response = await fetchCurrencyBreakdown();
        const data = response.data.data;
        setChartData(data);
      } catch (error) {
        console.error("Failed to load transaction volume", error);
      }
    };

    loadChart();
  }, []);
  return (
    <CardWrapper
      className="w-full md:flex-1 md:min-w-[max(320px,calc(50%-12px))] lg:min-w-[max(320px,calc(33.333%-16px))] max-w-full"
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
      <BarChartWrapper chartData={chartData} chartConfig={chartConfig} yAxisKeys={yAxisId} xAxisKey={xAxisId} />
    </CardWrapper>
  );
};
