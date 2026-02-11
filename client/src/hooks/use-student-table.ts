import { useState, useMemo } from "react";
import type { Student, Status } from "@/types";

interface UseStudentTableOptions {
  data: Student[];
  pageSize?: number;
}

export function useStudentTable({ data, pageSize = 8 }: UseStudentTableOptions) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [instituteFilter, setInstituteFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const institutes = useMemo(
    () => Array.from(new Set(data.map((s) => s.institute))).sort(),
    [data]
  );

  const filtered = useMemo(() => {
    let result = data;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((s) => s.status === statusFilter);
    }

    if (instituteFilter !== "all") {
      result = result.filter((s) => s.institute === instituteFilter);
    }

    return result;
  }, [data, search, statusFilter, instituteFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginated = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, safeCurrentPage, pageSize]);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setInstituteFilter("all");
    setCurrentPage(1);
  };

  return {
    search,
    setSearch: (val: string) => { setSearch(val); setCurrentPage(1); },
    statusFilter,
    setStatusFilter: (val: Status | "all") => { setStatusFilter(val); setCurrentPage(1); },
    instituteFilter,
    setInstituteFilter: (val: string) => { setInstituteFilter(val); setCurrentPage(1); },
    institutes,
    filtered,
    paginated,
    currentPage: safeCurrentPage,
    totalPages,
    goToPage,
    resetFilters,
    totalFiltered: filtered.length,
  };
}
