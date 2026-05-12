import { getMyProjects, getDashboardTaskStats } from "@/lib/actions/project.actions";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export async function DashboardStats() {
  const projects = await getMyProjects();
  
  const totalProjects = projects.length;
  const totalTasks = projects.reduce((acc, p) => acc + p._count.tasks, 0);
  const totalMembers = projects.reduce((acc, p) => acc + p.members.length, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {[
        { label: "Projects", value: totalProjects, icon: "📁", color: "text-blue-500 bg-blue-500/10" },
        { label: "Total Tasks", value: totalTasks, icon: "✅", color: "text-green-500 bg-green-500/10" },
        { label: "Team Members", value: totalMembers, icon: "👥", color: "text-violet-500 bg-violet-500/10" },
      ].map((stat) => (
        <div key={stat.label} className="group rounded-3xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-4 ${stat.color}`}>
            {stat.icon}
          </div>
          <div className="text-4xl font-heading font-bold text-foreground mb-1 leading-none">
            {stat.value}
          </div>
          <div className="text-[11px] text-muted-foreground font-body font-bold uppercase tracking-[0.15em]">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-40 rounded-3xl border border-border bg-muted/30 p-6" />
      ))}
    </div>
  );
}

export async function RecentProjects() {
  const projects = await getMyProjects();
  const recentProjects = projects.slice(0, 3);

  if (recentProjects.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border p-16 text-center bg-card/30">
        <p className="text-muted-foreground font-body mb-6">No projects yet. Create your first one!</p>
        <Link
          href="/dashboard/projects/new"
          className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold text-white hover:scale-[1.02] active:scale-[0.98] transition-all"
          style={{ background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)" }}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
          New Project
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {recentProjects.map((project) => (
        <Link
          key={project.id}
          href={`/dashboard/projects/${project.id}`}
          className="flex items-center justify-between rounded-2xl border border-border bg-card p-5 hover:bg-muted/30 hover:border-primary/20 transition-all group shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-sm font-bold text-white shrink-0 shadow-lg">
              {project.name[0].toUpperCase()}
            </div>
            <div>
              <h3 className="text-foreground font-body font-bold group-hover:text-primary transition-colors">{project.name}</h3>
              {project.description && (
                <p className="text-muted-foreground text-xs font-body mt-0.5 line-clamp-1">{project.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-6 shrink-0 ml-4">
            <div className="text-right hidden sm:block">
              <div className="text-foreground font-body font-bold text-sm">{project._count.tasks}</div>
              <div className="text-muted-foreground text-[10px] font-body uppercase tracking-wider font-bold">tasks</div>
            </div>
            <div className="flex -space-x-2">
              {project.members.slice(0, 3).map((m) => (
                <div key={m.id} className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 border-2 border-card flex items-center justify-center text-[10px] font-bold text-white" title={m.user.name ?? ""}>
                  {m.user.name?.[0]?.toUpperCase() ?? "?"}
                </div>
              ))}
            </div>
            <svg className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function ProjectsSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-24 rounded-2xl border border-border bg-muted/20" />
      ))}
    </div>
  );
}

// ─── Task Status Breakdown ────────────────────────────────────────────────────

export async function TaskStatusBreakdown() {
  const stats = await getDashboardTaskStats();
  const { byStatus, total } = stats;

  const statuses = [
    {
      key: "TODO",
      label: "To Do",
      value: byStatus.TODO,
      color: "bg-slate-400",
      textColor: "text-slate-400",
      bg: "bg-slate-400/10",
      icon: "○",
    },
    {
      key: "IN_PROGRESS",
      label: "In Progress",
      value: byStatus.IN_PROGRESS,
      color: "bg-amber-400",
      textColor: "text-amber-400",
      bg: "bg-amber-400/10",
      icon: "◑",
    },
    {
      key: "DONE",
      label: "Done",
      value: byStatus.DONE,
      color: "bg-emerald-500",
      textColor: "text-emerald-500",
      bg: "bg-emerald-500/10",
      icon: "●",
    },
  ];

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-body font-semibold text-foreground text-base">Tasks by Status</h2>
        <span className="text-xs text-muted-foreground font-body">{total} total</span>
      </div>

      <div className="space-y-4">
        {statuses.map((s) => {
          const pct = total > 0 ? Math.round((s.value / total) * 100) : 0;
          return (
            <div key={s.key}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className={`text-base leading-none ${s.textColor}`}>{s.icon}</span>
                  <span className="text-sm font-body text-foreground">{s.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold font-heading text-foreground">{s.value}</span>
                  <span className="text-xs text-muted-foreground w-8 text-right">{pct}%</span>
                </div>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full ${s.color} transition-all duration-700`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function TaskStatusSkeleton() {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm animate-pulse">
      <div className="h-4 bg-muted rounded w-32 mb-6" />
      <div className="space-y-5">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <div className="flex justify-between mb-2">
              <div className="h-3 bg-muted rounded w-20" />
              <div className="h-3 bg-muted rounded w-8" />
            </div>
            <div className="h-2 bg-muted rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tasks per User ───────────────────────────────────────────────────────────

export async function TasksPerUser() {
  const stats = await getDashboardTaskStats();
  const { tasksPerUser } = stats;

  if (tasksPerUser.length === 0) {
    return (
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <h2 className="font-body font-semibold text-foreground text-base mb-4">Tasks per User</h2>
        <p className="text-muted-foreground text-sm font-body">No assigned tasks yet.</p>
      </div>
    );
  }

  const maxCount = tasksPerUser[0].count;

  const avatarColors = [
    "from-violet-600 to-blue-600",
    "from-pink-600 to-rose-600",
    "from-amber-500 to-orange-600",
    "from-teal-500 to-cyan-600",
    "from-indigo-500 to-purple-600",
    "from-emerald-500 to-green-600",
  ];

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <h2 className="font-body font-semibold text-foreground text-base mb-6">Tasks per User</h2>
      <div className="space-y-4">
        {tasksPerUser.map((u, i) => {
          const pct = Math.round((u.count / maxCount) * 100);
          return (
            <div key={u.name} className="flex items-center gap-3">
              <div
                className={`w-8 h-8 shrink-0 rounded-full bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-[11px] font-bold text-white shadow-sm`}
              >
                {u.name[0]?.toUpperCase() ?? "?"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-body text-foreground truncate">{u.name}</span>
                  <span className="text-sm font-bold font-heading text-foreground ml-2 shrink-0">
                    {u.count}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-600 to-blue-500 transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function TasksPerUserSkeleton() {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm animate-pulse">
      <div className="h-4 bg-muted rounded w-28 mb-6" />
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-muted shrink-0" />
            <div className="flex-1">
              <div className="flex justify-between mb-1.5">
                <div className="h-3 bg-muted rounded w-24" />
                <div className="h-3 bg-muted rounded w-6" />
              </div>
              <div className="h-1.5 bg-muted rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Overdue Tasks ────────────────────────────────────────────────────────────

export async function OverdueTasks() {
  const stats = await getDashboardTaskStats();
  const { overdueTasks } = stats;

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-body font-semibold text-foreground text-base">Overdue Tasks</h2>
        {overdueTasks.length > 0 && (
          <span className="text-xs font-bold text-rose-500 bg-rose-500/10 px-2.5 py-1 rounded-full">
            {overdueTasks.length} overdue
          </span>
        )}
      </div>

      {overdueTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-2xl mb-3">
            ✓
          </div>
          <p className="text-sm text-muted-foreground font-body">No overdue tasks. You&apos;re on track!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {overdueTasks.map((task) => {
            const overdueSince = formatDistanceToNow(new Date(task.dueDate), {
              addSuffix: true,
            });
            return (
              <div
                key={task.id}
                className="flex items-start gap-3 p-3 rounded-xl bg-rose-500/5 border border-rose-500/15 hover:border-rose-500/30 transition-colors group"
              >
                <div className="w-2 h-2 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-body font-medium text-foreground truncate group-hover:text-rose-400 transition-colors">
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-muted-foreground font-body truncate">
                      {task.projectName}
                    </span>
                    <span className="text-[11px] text-muted-foreground">·</span>
                    <span className="text-[11px] text-rose-400 font-body shrink-0">
                      Due {overdueSince}
                    </span>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
                    task.status === "IN_PROGRESS"
                      ? "bg-amber-400/10 text-amber-400"
                      : "bg-slate-400/10 text-slate-400"
                  }`}
                >
                  {task.status === "IN_PROGRESS" ? "In Progress" : "To Do"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function OverdueTasksSkeleton() {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm animate-pulse">
      <div className="flex justify-between mb-6">
        <div className="h-4 bg-muted rounded w-28" />
        <div className="h-5 bg-muted rounded-full w-16" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-muted/50 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
