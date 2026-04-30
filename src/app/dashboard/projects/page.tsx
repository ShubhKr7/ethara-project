import { Suspense } from "react";
import { getMyProjects } from "@/lib/actions/project.actions";
import Link from "next/link";

function ProjectGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-48 rounded-2xl border border-white/5 bg-white/3 p-6" />
      ))}
    </div>
  );
}

async function ProjectsGrid() {
  const projects = await getMyProjects();

  if (projects.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 p-16 text-center">
        <div className="text-5xl mb-4">📁</div>
        <h2 className="text-white font-body font-semibold text-lg mb-2">No projects yet</h2>
        <p className="text-white/40 text-sm font-body mb-6">Create your first project to start organizing tasks.</p>
        <Link
          href="/dashboard/projects/new"
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)" }}
        >
          Create Project
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {projects.map((project) => {
        const inProgressCount = project.tasks.filter((t) => t.status === "IN_PROGRESS").length;
        const doneCount = project.tasks.filter((t) => t.status === "DONE").length;

        return (
          <Link
            key={project.id}
            href={`/dashboard/projects/${project.id}`}
            className="group flex flex-col rounded-2xl border border-white/8 bg-white/3 p-6 hover:bg-white/6 hover:border-white/15 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-lg font-bold text-white shrink-0">
                {project.name[0].toUpperCase()}
              </div>
              <svg className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors mt-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>
            </div>

            <h3 className="text-white font-body font-semibold text-base mb-1 group-hover:text-violet-300 transition-colors">{project.name}</h3>
            {project.description && (
              <p className="text-white/40 text-sm font-body line-clamp-2 mb-4">{project.description}</p>
            )}

            <div className="flex gap-2 mt-auto mb-4 flex-wrap">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/5 border border-white/8 px-2.5 py-0.5 text-[11px] font-body text-white/50">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                {project._count.tasks} total
              </span>
              {inProgressCount > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[11px] font-body text-amber-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  {inProgressCount} in progress
                </span>
              )}
              {doneCount > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 border border-green-500/20 px-2.5 py-0.5 text-[11px] font-body text-green-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  {doneCount} done
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                {project.members.slice(0, 4).map((m) => (
                  <div key={m.id} className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 border-2 border-[#080810] flex items-center justify-center text-[10px] font-bold text-white" title={m.user.name ?? ""}>
                    {m.user.name?.[0]?.toUpperCase() ?? "?"}
                  </div>
                ))}
              </div>
              <span className="text-white/25 text-[11px] font-body">
                {new Date(project.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default async function ProjectsPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading italic text-white text-4xl tracking-tight">Projects</h1>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white hover:scale-[1.02] transition-transform"
          style={{ background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)" }}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
          New Project
        </Link>
      </div>

      <Suspense fallback={<ProjectGridSkeleton />}>
        <ProjectsGrid />
      </Suspense>
    </div>
  );
}
