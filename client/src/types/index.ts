export type Role = "admin" | "teacher" | "staff" | "student";
export type Status = "active" | "inactive" | "suspended";

export interface Student {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: Status;
  phone: string;
  institute: string;
  enrolledAt: string;
}

export interface StatsCard {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
}
