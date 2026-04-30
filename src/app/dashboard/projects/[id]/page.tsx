import { getProjectById } from "@/lib/actions/project.actions";
import { KanbanBoard } from "@/components/dashboard/KanbanBoard";
import { DeleteProjectButton } from "@/components/dashboard/DeleteProjectButton";
import { EditableProjectHeader } from "@/components/dashboard/EditableProjectHeader";
import { auth } from "@/auth";
import Link from "next/link";

export default async function ProjectBoardPage({ params }: { params: { id: string } }) {
  const session = await auth();
  const project = await getProjectById(params.id);
  const isOwner = project.ownerId === session?.user?.id;

  return (
    <div className="p-8 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4 shrink-0">
        <div>
        <EditableProjectHeader
          projectId={project.id}
          initialName={project.name}
          initialDescription={project.description}
        />
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex -space-x-2">
            {project.members.map((m) => (
              <div key={m.id} className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 border-2 border-[#080810] flex items-center justify-center text-[11px] font-bold text-white" title={m.user.name ?? ""}>
                {m.user.name?.[0]?.toUpperCase() ?? "?"}
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-white/8 bg-white/3 px-3 py-1.5 text-xs text-white/50 font-body">
            {project.tasks.length} task{project.tasks.length !== 1 ? "s" : ""}
          </div>
          {isOwner && <DeleteProjectButton projectId={project.id} />}
        </div>
      </div>

      {/* Kanban */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <KanbanBoard
          projectId={project.id}
          tasks={project.tasks.map((t) => ({ ...t, dueDate: t.dueDate ?? null }))}
          members={project.members.map((m) => ({ userId: m.userId, user: m.user }))}
        />
      </div>
    </div>
  );
}
