import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { StudentFilters } from "@/components/student-filters";
import { StudentTable } from "@/components/student-table";
import { Pagination } from "@/components/pagination";
import { useStudentTable } from "@/hooks/use-student-table";
import { studentsData } from "@/data/mock";
import gsap from "gsap";

export function StudentsPage() {
  const ref = useRef<HTMLDivElement>(null);
  const table = useStudentTable({ data: studentsData });

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
    );
  }, []);

  return (
    <div ref={ref} className="space-y-6 opacity-0">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Students</h1>
        <p className="text-muted-foreground">Manage and view all student records.</p>
      </div>
      <Card>
        <CardContent className="p-6 space-y-4">
          <StudentFilters
            search={table.search}
            onSearchChange={table.setSearch}
            statusFilter={table.statusFilter}
            onStatusChange={table.setStatusFilter}
            instituteFilter={table.instituteFilter}
            onInstituteChange={table.setInstituteFilter}
            institutes={table.institutes}
            onReset={table.resetFilters}
            totalFiltered={table.totalFiltered}
            totalAll={studentsData.length}
          />
          <StudentTable students={table.paginated} />
          <Pagination
            currentPage={table.currentPage}
            totalPages={table.totalPages}
            onPageChange={table.goToPage}
          />
        </CardContent>
      </Card>
    </div>
  );
}
