import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { BarChartWrapperProps } from "@/interfaces";

export const BarChartWrapper = <T extends Record<string, any>>({
  chartData,
  chartConfig,
  xAxisKey,
  yAxisKeys
}: BarChartWrapperProps<T>) => {
  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-auto h-[250px] w-full"
    >
      <BarChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={xAxisKey}
          tickLine={false}
          tickMargin={10}
          axisLine={true}
          tickFormatter={(value) => value}
        />
        {yAxisKeys.map((key: string) => (
          <YAxis
            key={key}
            yAxisId={key}
            hide
            domain={[0, "auto"]}
          />
        ))}

        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent />}
        />
        {yAxisKeys.map((key: string) => (
          <Bar
          key={key}
          yAxisId={key}
          dataKey={key}
          maxBarSize={24}
          fill={`var(--color-${key})`}
        />
        ))}
      </BarChart>
    </ChartContainer>
  );
};
