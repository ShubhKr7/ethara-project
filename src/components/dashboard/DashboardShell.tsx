import { getMyProjects } from "@/lib/actions/project.actions";
import Link from "next/link";

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
