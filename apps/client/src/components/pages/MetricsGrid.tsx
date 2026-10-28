import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import { CardWrapper } from "@/components/pages/CardWrapper";
export const MetricsGrid = () => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 lg:gap-6 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
        <CardWrapper
          title="Total Revenue"
          description={<div className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">$1,250.00</div>}
          action={
            <Badge variant="outline" className="rounded p-3">
              <TrendingUp />
              +12.5%
            </Badge>
          }
          footer={
            <>
              <div className="line-clamp-1 flex gap-2 font-medium">
                Trending up this month <TrendingUp className="size-4" />
              </div>
              <div className="text-muted-foreground">
                Visitors for the last 6 months
              </div>
            </>
          }
        ></CardWrapper>
        <CardWrapper
          title="Total Revenue"
          description={<div className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">$1,250.00</div>}
          action={
            <Badge variant="outline" className="rounded p-3">
              <TrendingUp />
              +12.5%
            </Badge>
          }
          footer={
            <>
              <div className="line-clamp-1 flex gap-2 font-medium">
                Trending up this month <TrendingUp className="size-4" />
              </div>
              <div className="text-muted-foreground">
                Visitors for the last 6 months
              </div>
            </>
          }
        ></CardWrapper>
        <CardWrapper
          title="Total Revenue"
          description={<div className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">$1,250.00</div>}
          action={
            <Badge variant="outline" className="rounded p-3">
              <TrendingUp />
              +12.5%
            </Badge>
          }
          footer={
            <>
              <div className="line-clamp-1 flex gap-2 font-medium">
                Trending up this month <TrendingUp className="size-4" />
              </div>
              <div className="text-muted-foreground">
                Visitors for the last 6 months
              </div>
            </>
          }
        ></CardWrapper>
        <CardWrapper
          title="Total Revenue"
          description={<div className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">$1,250.00</div>}
          action={
            <Badge variant="outline" className="rounded p-3">
              <TrendingUp />
              +12.5%
            </Badge>
          }
          footer={
            <>
              <div className="line-clamp-1 flex gap-2 font-medium">
                Trending up this month <TrendingUp className="size-4" />
              </div>
              <div className="text-muted-foreground">
                Visitors for the last 6 months
              </div>
            </>
          }
        ></CardWrapper>
      </div>
    </>
  );
};
