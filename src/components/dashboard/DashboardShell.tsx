import { getMyProjects } from "@/lib/actions/project.actions";
import Link from "next/link";

export async function DashboardStats() {
  const projects = await getMyProjects();
  
  const totalProjects = projects.length;
  const totalTasks = projects.reduce((acc, p) => acc + p._count.tasks, 0);
  const totalMembers = projects.reduce((acc, p) => acc + p.members.length, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
      {[
        { label: "Projects", value: totalProjects, icon: "📁" },
        { label: "Total Tasks", value: totalTasks, icon: "✅" },
        { label: "Team Members", value: totalMembers, icon: "👥" },
      ].map((stat) => (
        <div key={stat.label} className="rounded-2xl border border-white/8 bg-white/3 p-5 backdrop-blur-sm">
          <div className="text-2xl mb-2">{stat.icon}</div>
          <div className="text-3xl font-heading font-bold text-white">{stat.value}</div>
          <div className="text-xs text-white/40 font-body mt-1 uppercase tracking-wider">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-32 rounded-2xl border border-white/5 bg-white/3 p-5" />
      ))}
    </div>
  );
}

export async function RecentProjects() {
  const projects = await getMyProjects();
  const recentProjects = projects.slice(0, 3);

  if (recentProjects.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center">
        <p className="text-white/40 font-body mb-4">No projects yet. Create your first one!</p>
        <Link
          href="/dashboard/projects/new"
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)" }}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
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
          className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/3 p-5 hover:bg-white/6 hover:border-white/15 transition-all group"
        >
          <div>
            <h3 className="text-white font-body font-semibold group-hover:text-violet-300 transition-colors">{project.name}</h3>
            {project.description && (
              <p className="text-white/40 text-sm font-body mt-0.5 line-clamp-1">{project.description}</p>
            )}
          </div>
          <div className="flex items-center gap-4 shrink-0 ml-4">
            <div className="text-right">
              <div className="text-white font-body font-semibold text-sm">{project._count.tasks}</div>
              <div className="text-white/30 text-[11px] font-body">tasks</div>
            </div>
            <div className="flex -space-x-2">
              {project.members.slice(0, 3).map((m) => (
                <div key={m.id} className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 border-2 border-[#080810] flex items-center justify-center text-[10px] font-bold text-white">
                  {m.user.name?.[0] ?? "?"}
                </div>
              ))}
            </div>
            <svg className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>
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
        <div key={i} className="h-24 rounded-2xl border border-white/5 bg-white/2" />
      ))}
    </div>
  );
}
