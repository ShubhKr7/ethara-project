import { getSuperAdminProjectById } from "@/lib/actions/superadmin.actions";
import { KanbanBoard } from "@/components/dashboard/KanbanBoard";
import { DeleteProjectButton } from "@/components/dashboard/DeleteProjectButton";
import { EditableProjectHeader } from "@/components/dashboard/EditableProjectHeader";
import { auth } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SuperAdminProjectBoardPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "SUPER_ADMIN") redirect("/dashboard");
  
  const id = (await params).id;
  const project = await getSuperAdminProjectById(id);

  return (
    <div className="p-8 md:p-10 h-full flex flex-col bg-background transition-colors duration-300 min-h-screen">
      <div className="mb-6">
        <Link href={`/superadmin/organizations/${project.organizationId}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Organization
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between mb-10 gap-6 shrink-0">
        <div className="flex-1 min-w-0">
          <EditableProjectHeader
            projectId={project.id}
            initialName={project.name}
            initialDescription={project.description}
          />
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="flex -space-x-3 hover:-space-x-2 transition-all duration-300">
            {project.members.map((m) => (
              <div 
                key={m.id} 
                className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 border-2 border-background flex items-center justify-center text-[11px] font-bold text-white shadow-lg transition-transform hover:scale-110 hover:z-10 relative" 
                title={m.user.name ?? ""}
              >
                {m.user.name?.[0]?.toUpperCase() ?? "?"}
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-border bg-card px-4 py-2 text-xs text-muted-foreground font-bold uppercase tracking-widest shadow-sm">
            {project.tasks.length} task{project.tasks.length !== 1 ? "s" : ""}
          </div>
          <DeleteProjectButton projectId={project.id} redirectUrl={`/superadmin/organizations/${project.organizationId}`} />
        </div>
      </div>

      {/* Kanban */}
      <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
        <KanbanBoard
          projectId={project.id}
          tasks={project.tasks.map((t) => ({ ...t, dueDate: t.dueDate ?? null }))}
          members={project.members.map((m) => ({ userId: m.userId, user: m.user }))}
        />
      </div>
    </div>
  );
}
