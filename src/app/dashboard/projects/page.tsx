import { Suspense } from "react";
import { getMyProjects } from "@/lib/actions/project.actions";
import Link from "next/link";

function ProjectGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-56 rounded-3xl border border-border bg-card/50 p-6" />
      ))}
    </div>
  );
}

async function ProjectsGrid() {
  const projects = await getMyProjects();

  if (projects.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border p-16 text-center bg-card/30">
        <div className="text-6xl mb-6 opacity-40">📁</div>
        <h2 className="text-foreground font-heading italic text-2xl mb-2">No projects yet</h2>
        <p className="text-muted-foreground text-sm font-body mb-8 max-w-sm mx-auto">Create your first project to start organizing tasks and collaborating with your team.</p>
        <Link
          href="/dashboard/projects/new"
          className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold text-white hover:scale-[1.02] active:scale-[0.98] transition-all"
          style={{ background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)" }}
        >
          Create Project
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {projects.map((project) => {
        const inProgressCount = project.tasks.filter((t) => t.status === "IN_PROGRESS").length;
        const doneCount = project.tasks.filter((t) => t.status === "DONE").length;

        return (
          <Link
            key={project.id}
            href={`/dashboard/projects/${project.id}`}
            className="group flex flex-col rounded-3xl border border-border bg-card p-6 hover:shadow-xl hover:border-primary/20 transition-all shadow-sm"
          >
            <div className="flex items-start justify-between mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-xl font-bold text-white shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                {project.name[0].toUpperCase()}
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted/50 border border-border">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-bold text-foreground/60 uppercase tracking-wider">{project._count.tasks} Tasks</span>
              </div>
            </div>

            <h3 className="text-foreground font-heading italic text-2xl mb-1 group-hover:text-primary transition-colors">{project.name}</h3>
            {project.description && (
              <p className="text-muted-foreground text-sm font-body line-clamp-2 mb-6 min-h-[2.5rem] leading-relaxed">{project.description}</p>
            )}

            <div className="flex gap-2 mb-6 flex-wrap">
              {inProgressCount > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-[10px] font-bold text-amber-600 uppercase tracking-tight">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  {inProgressCount} in progress
                </span>
              )}
              {doneCount > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 border border-green-500/20 px-3 py-1 text-[10px] font-bold text-green-600 uppercase tracking-tight">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  {doneCount} done
                </span>
              )}
              {inProgressCount === 0 && doneCount === 0 && project._count.tasks > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted border border-border px-3 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                  New tasks
                </span>
              )}
            </div>

            <div className="flex items-center justify-between pt-5 border-t border-border mt-auto">
              <div className="flex -space-x-2.5">
                {project.members.slice(0, 4).map((m) => (
                  <div key={m.id} className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 border-2 border-card flex items-center justify-center text-[10px] font-bold text-white shadow-sm transition-transform hover:scale-110 hover:z-10" title={m.user.name ?? ""}>
                    {m.user.name?.[0]?.toUpperCase() ?? "?"}
                  </div>
                ))}
                {project.members.length > 4 && (
                  <div className="w-8 h-8 rounded-full bg-muted border-2 border-card flex items-center justify-center text-[10px] font-bold text-muted-foreground shadow-sm">
                    +{project.members.length - 4}
                  </div>
                )}
              </div>
              <span className="text-muted-foreground/40 text-[10px] font-bold uppercase tracking-widest">
                {new Date(project.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
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
    <div className="p-8 md:p-12 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="font-heading italic text-foreground text-5xl md:text-6xl tracking-tight">Projects</h1>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold text-white shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
          style={{ background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)" }}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
          New Project
        </Link>
      </div>

      <Suspense fallback={<ProjectGridSkeleton />}>
        <ProjectsGrid />
      </Suspense>
    </div>
  );
}
