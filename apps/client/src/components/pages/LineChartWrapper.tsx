import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { LineChartWrapperProps } from "@/interfaces"


export const LineChartWrapper = <T extends Record<string, any>>({
  chartData,
  chartConfig,
  xAxisKey,
  lineKey,
}: LineChartWrapperProps<T>) => {
  const activeColorVar = `var(--color-${String(lineKey)})`
  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{ left: 12, right: 12 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={`date`}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => 
            typeof value === "string" ? value : String(value)
          }
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel nameKey={lineKey as string} />}
        />
        <Line
          dataKey={`count`}
          type="natural"
          stroke={activeColorVar}
          strokeWidth={2}
          dot={{ fill: activeColorVar }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ChartContainer>
  );
}
