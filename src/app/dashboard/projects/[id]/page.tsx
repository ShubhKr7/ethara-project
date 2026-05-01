import { getProjectById } from "@/lib/actions/project.actions";
import { KanbanBoard } from "@/components/dashboard/KanbanBoard";
import { DeleteProjectButton } from "@/components/dashboard/DeleteProjectButton";
import { EditableProjectHeader } from "@/components/dashboard/EditableProjectHeader";
import { auth } from "@/auth";
import Link from "next/link";

export default async function ProjectBoardPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const id = (await params).id;
  const project = await getProjectById(id);
  const isOwner = project.ownerId === session?.user?.id;

  return (
    <div className="p-8 md:p-10 h-full flex flex-col bg-background transition-colors duration-300">
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
                className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 border-2 border-background flex items-center justify-center text-[11px] font-bold text-white shadow-lg transition-transform hover:scale-110 hover:z-10" 
                title={m.user.name ?? ""}
              >
                {m.user.name?.[0]?.toUpperCase() ?? "?"}
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-border bg-card px-4 py-2 text-xs text-muted-foreground font-bold uppercase tracking-widest shadow-sm">
            {project.tasks.length} task{project.tasks.length !== 1 ? "s" : ""}
          </div>
          {isOwner && <DeleteProjectButton projectId={project.id} />}
        </div>
      </div>

      {/* Kanban */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4 custom-scrollbar">
        <KanbanBoard
          projectId={project.id}
          tasks={project.tasks.map((t) => ({ ...t, dueDate: t.dueDate ?? null }))}
          members={project.members.map((m) => ({ userId: m.userId, user: m.user }))}
        />
      </div>
    </div>
  );
}
