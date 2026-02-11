import { useEffect, useRef } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import gsap from "gsap";
import type { Student, Status } from "@/types";

const statusVariant: Record<Status, "success" | "warning" | "danger"> = {
  active: "success",
  inactive: "warning",
  suspended: "danger",
};

interface StudentTableProps {
  students: Student[];
}

export function StudentTable({ students }: StudentTableProps) {
  const bodyRef = useRef<HTMLTableSectionElement>(null);

  useEffect(() => {
    if (!bodyRef.current) return;
    const rows = bodyRef.current.querySelectorAll("tr");
    gsap.fromTo(
      rows,
      { opacity: 0, x: -12 },
      { opacity: 1, x: 0, duration: 0.3, stagger: 0.04, ease: "power2.out" }
    );
  }, [students]);

  if (students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <p className="text-sm">No students found matching your filters.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead className="hidden md:table-cell">Email</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="hidden lg:table-cell">Enrolled</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody ref={bodyRef}>
        {students.map((student) => (
          <TableRow key={student.id}>
            <TableCell className="font-mono text-xs">{student.id}</TableCell>
            <TableCell className="font-medium">{student.name}</TableCell>
            <TableCell className="hidden md:table-cell text-muted-foreground">{student.email}</TableCell>
            <TableCell>{student.institute}</TableCell>
            <TableCell>
              <Badge variant={statusVariant[student.status]}>{student.status}</Badge>
            </TableCell>
            <TableCell className="hidden lg:table-cell text-muted-foreground">
              {new Date(student.enrolledAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
