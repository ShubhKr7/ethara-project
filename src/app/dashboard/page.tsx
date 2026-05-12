import { Suspense } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  DashboardStats,
  StatsSkeleton,
  RecentProjects,
  ProjectsSkeleton,
  TaskStatusBreakdown,
  TaskStatusSkeleton,
  TasksPerUser,
  TasksPerUserSkeleton,
  OverdueTasks,
  OverdueTasksSkeleton,
} from "@/components/dashboard/DashboardShell";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const firstName = session.user.name?.split(" ")[0] ?? "there";

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <p className="text-muted-foreground text-sm font-body mb-1">
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>
        <h1 className="font-heading italic text-foreground text-5xl md:text-6xl tracking-tight">
          Good to see you, {firstName}.
        </h1>
      </div>

      {/* Summary Stats */}
      <Suspense fallback={<StatsSkeleton />}>
        <DashboardStats />
      </Suspense>

      {/* Task Analytics */}
      <div className="mb-6">
        <h2 className="text-foreground font-body font-semibold text-lg">Task Analytics</h2>
        <p className="text-muted-foreground text-sm font-body mt-0.5">Across all your projects</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <Suspense fallback={<TaskStatusSkeleton />}>
          <TaskStatusBreakdown />
        </Suspense>

        <Suspense fallback={<TasksPerUserSkeleton />}>
          <TasksPerUser />
        </Suspense>
      </div>

      {/* Overdue Tasks */}
      <div className="mb-10">
        <Suspense fallback={<OverdueTasksSkeleton />}>
          <OverdueTasks />
        </Suspense>
      </div>

      {/* Recent Projects */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-foreground font-body font-semibold text-lg">Recent Projects</h2>
        <Link href="/dashboard/projects" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-body">
          View all →
        </Link>
      </div>

      <Suspense fallback={<ProjectsSkeleton />}>
        <RecentProjects />
      </Suspense>
    </div>
  );
}
