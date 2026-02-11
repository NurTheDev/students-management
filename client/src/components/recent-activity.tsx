import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import gsap from "gsap";

export function RecentActivity() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, delay: 0.5, ease: "power2.out" }
    );
  }, []);

  const activities = [
    { action: "New enrollment", detail: "Sarah Johnson joined Computer Science", time: "2 min ago" },
    { action: "Grade updated", detail: "Physics midterm results published", time: "15 min ago" },
    { action: "Attendance marked", detail: "Morning session for Engineering", time: "1 hr ago" },
    { action: "Course added", detail: "Advanced Mathematics Spring 2025", time: "3 hr ago" },
    { action: "Student transferred", detail: "David Kim moved to Engineering", time: "5 hr ago" },
  ];

  return (
    <Card ref={ref} className="opacity-0">
      <CardHeader>
        <CardTitle className="text-base">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((item, i) => (
            <div key={i} className="flex items-start justify-between gap-4 text-sm">
              <div>
                <p className="font-medium">{item.action}</p>
                <p className="text-muted-foreground">{item.detail}</p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">{item.time}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
