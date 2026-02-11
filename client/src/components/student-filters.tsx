import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Status } from "@/types";

interface StudentFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  statusFilter: Status | "all";
  onStatusChange: (val: Status | "all") => void;
  instituteFilter: string;
  onInstituteChange: (val: string) => void;
  institutes: string[];
  onReset: () => void;
  totalFiltered: number;
  totalAll: number;
}

export function StudentFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  instituteFilter,
  onInstituteChange,
  institutes,
  onReset,
  totalFiltered,
  totalAll,
}: StudentFiltersProps) {
  const hasFilters = search || statusFilter !== "all" || instituteFilter !== "all";

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email or ID..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={(val) => onStatusChange(val as Status | "all")}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
          <Select value={instituteFilter} onValueChange={onInstituteChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {institutes.map((inst) => (
                <SelectItem key={inst} value={inst}>{inst}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={onReset} className="gap-1">
              <X className="h-3 w-3" />
              Clear
            </Button>
          )}
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        Showing {totalFiltered} of {totalAll} students
      </p>
    </div>
  );
}
