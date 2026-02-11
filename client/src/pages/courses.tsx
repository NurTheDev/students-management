import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CoursesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Courses</h1>
        <p className="text-muted-foreground">Manage course offerings and schedules.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Course Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Course management features will be available here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
