import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import gsap from "gsap";

const departments = [
  { name: "Computer Science", count: 520, percentage: 72 },
  { name: "Engineering", count: 480, percentage: 65 },
  { name: "Mathematics", count: 340, percentage: 58 },
  { name: "Physics", count: 290, percentage: 48 },
  { name: "Chemistry", count: 245, percentage: 42 },
  { name: "Biology", count: 210, percentage: 38 },
];

export function DepartmentOverview() {
  const ref = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, delay: 0.6, ease: "power2.out" }
    );
  }, []);

  useEffect(() => {
    if (!barsRef.current) return;
    const bars = barsRef.current.querySelectorAll("[data-bar]");
    gsap.fromTo(
      bars,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.6, delay: 0.8, stagger: 0.08, ease: "power2.out", transformOrigin: "left" }
    );
  }, []);

  return (
    <Card ref={ref} className="opacity-0">
      <CardHeader>
        <CardTitle className="text-base">Department Overview</CardTitle>
      </CardHeader>
      <CardContent ref={barsRef}>
        <div className="space-y-4">
          {departments.map((dept) => (
            <div key={dept.name} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{dept.name}</span>
                <span className="text-muted-foreground">{dept.count} students</span>
              </div>
              <div className="h-2 rounded-full bg-secondary">
                <div
                  data-bar
                  className="h-full rounded-full bg-foreground/70"
                  style={{ width: `${dept.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
