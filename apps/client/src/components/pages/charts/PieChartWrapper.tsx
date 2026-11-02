import { LabelList, Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { PieChartWrapperProps } from "@/interfaces";

export const PieChartWrapper = <T extends Record<string, any>>({
  chartData,
  chartConfig,
  dataKey,
  labelKey,
}: PieChartWrapperProps<T>) => {
  return (
    <ChartContainer
      config={chartConfig}
      className="h-[250px] w-full [&_.recharts-text]:fill-background"
    >
      <PieChart>
        <ChartTooltip
          content={<ChartTooltipContent labelKey={labelKey} />}
        />
        <Pie data={chartData} dataKey={dataKey}>
          <LabelList
            dataKey={dataKey}
            className="fill-background"
            stroke="none"
            fontSize={14}
            formatter={(value: any) => {
              const configKey = value as keyof typeof chartConfig;
              const labelText = chartConfig[configKey]?.label;
              return typeof labelText === 'string' ? labelText : String(value);
            }} 
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
};
