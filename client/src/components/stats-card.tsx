import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import type { StatsCard as StatsCardType } from "@/types";

interface StatsCardProps {
  data: StatsCardType;
  index: number;
}

export function StatsCard({ data, index }: StatsCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.5, delay: index * 0.1, ease: "power2.out" }
    );
  }, [index]);

  return (
    <Card ref={ref} className="opacity-0">
      <CardContent className="p-6">
        <p className="text-sm text-muted-foreground">{data.title}</p>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-2xl font-bold">{data.value}</span>
          <span
            className={cn(
              "flex items-center gap-1 text-xs font-medium",
              data.trend === "up" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
            )}
          >
            {data.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {data.change}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
