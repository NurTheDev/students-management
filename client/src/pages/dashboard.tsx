import { StatsCard } from "@/components/stats-card";
import { RecentActivity } from "@/components/recent-activity";
import { DepartmentOverview } from "@/components/department-overview";
import { statsData } from "@/data/mock";

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground">Welcome back. Here is a summary of your institution.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, i) => (
          <StatsCard key={stat.title} data={stat} index={i} />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentActivity />
        <DepartmentOverview />
      </div>
    </div>
  );
}
