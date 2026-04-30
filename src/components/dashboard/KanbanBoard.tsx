"use client";

import { useState, useTransition, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { updateTaskStatus, createTask } from "@/lib/actions/task.actions";
import { DeleteTaskButton } from "@/components/dashboard/DeleteTaskButton";
import { TaskStatus, TaskPriority } from "@prisma/client";

type Member = { id: string; name: string | null; image: string | null };
type Task = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date | null;
  assignee: Member | null;
};

const COLUMNS: { id: TaskStatus; label: string; border: string; dot: string; glow: string }[] = [
  { id: "TODO",        label: "To Do",       border: "border-slate-500/20", dot: "bg-slate-400",  glow: "bg-slate-500/5"  },
  { id: "IN_PROGRESS", label: "In Progress", border: "border-amber-500/20", dot: "bg-amber-400",  glow: "bg-amber-500/5"  },
  { id: "DONE",        label: "Done",        border: "border-green-500/20", dot: "bg-green-400",  glow: "bg-green-500/5"  },
];

const PRIORITY_STYLES: Record<TaskPriority, { label: string; cls: string }> = {
  LOW:    { label: "Low",    cls: "text-blue-400  bg-blue-500/10  border-blue-500/20"  },
  MEDIUM: { label: "Medium", cls: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  HIGH:   { label: "High",   cls: "text-red-400   bg-red-500/10   border-red-500/20"   },
};

/* ─────────────────────────────────────────────
   Droppable column zone
───────────────────────────────────────────── */
function DroppableColumn({
  id, children, isOver,
}: { id: string; children: React.ReactNode; isOver: boolean }) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col gap-2.5 flex-1 min-h-[120px] rounded-xl transition-colors ${
        isOver ? "bg-white/5 ring-1 ring-white/10" : ""
      }`}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Sortable task card
───────────────────────────────────────────── */
function TaskCard({ 
  task, 
  projectId, 
  onDelete,
  overlay = false 
}: { 
  task: Task; 
  projectId: string; 
  onDelete?: (id: string) => void;
  overlay?: boolean 
}) {
  const {
    attributes, listeners, setNodeRef, transform, transition, isDragging,
  } = useSortable({ id: task.id, data: { status: task.status } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging && !overlay ? 0.35 : 1,
  };

  const p = PRIORITY_STYLES[task.priority];
  const overdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "DONE";

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group rounded-xl border border-white/8 bg-white/4 p-4 cursor-grab active:cursor-grabbing
        hover:border-white/15 hover:bg-white/6 transition-all select-none
        ${overlay ? "shadow-2xl rotate-[1.5deg] border-violet-400/20 bg-[#1a1030]" : ""}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-sm font-body text-white font-medium leading-snug flex-1">{task.title}</p>
        {!overlay && (
          <DeleteTaskButton 
            taskId={task.id} 
            projectId={projectId} 
            onDeleteSuccess={() => onDelete?.(task.id)} 
          />
        )}
      </div>

      {task.description && (
        <p className="text-xs text-white/35 font-body mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-[10px] font-body font-semibold border rounded-full px-2 py-0.5 ${p.cls}`}>
          {p.label}
        </span>
        {task.dueDate && (
          <span className={`text-[10px] font-body ml-auto ${overdue ? "text-red-400" : "text-white/30"}`}>
            {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        )}
        {task.assignee && (
          <div
            className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-[9px] font-bold text-white"
            title={task.assignee.name ?? ""}
          >
            {task.assignee.name?.[0]?.toUpperCase() ?? "?"}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Inline create-task form
───────────────────────────────────────────── */
function CreateTaskForm({
  projectId, status, members, onClose,
}: {
  projectId: string; status: TaskStatus; members: { userId: string; user: Member }[]; onClose: () => void;
}) {
  const [pending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      await createTask({
        projectId,
        title:      fd.get("title")      as string,
        description:(fd.get("description") as string) || undefined,
        priority:   fd.get("priority")   as TaskPriority,
        status,
        dueDate:   (fd.get("dueDate")    as string) || undefined,
        assigneeId:(fd.get("assigneeId") as string) || undefined,
      });
      onClose();
    });
  };

  return (
    <div className="mt-1 rounded-xl border border-violet-500/30 bg-violet-500/5 p-3">
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          name="title" required autoFocus placeholder="Task title…"
          className="block w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/25 focus:border-violet-500/50 focus:outline-none font-body"
        />
        <input
          name="description" placeholder="Description (optional)"
          className="block w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/25 focus:outline-none font-body"
        />
        <div className="flex gap-2">
          <select name="priority" defaultValue="MEDIUM"
            className="flex-1 rounded-lg border border-white/10 bg-[#0d0d1a] px-3 py-2 text-sm text-white focus:outline-none font-body">
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
          <input type="date" name="dueDate"
            className="flex-1 rounded-lg border border-white/10 bg-[#0d0d1a] px-3 py-2 text-sm text-white focus:outline-none font-body" />
        </div>
        {members.length > 1 && (
          <select name="assigneeId"
            className="block w-full rounded-lg border border-white/10 bg-[#0d0d1a] px-3 py-2 text-sm text-white focus:outline-none font-body">
            <option value="">Unassigned</option>
            {members.map((m) => <option key={m.userId} value={m.userId}>{m.user.name}</option>)}
          </select>
        )}
        <div className="flex gap-2 pt-1">
          <button type="button" onClick={onClose}
            className="flex-1 rounded-lg border border-white/10 py-2 text-xs text-white/40 hover:text-white transition-colors font-body">
            Cancel
          </button>
          <button type="submit" disabled={pending}
            className="flex-1 rounded-lg py-2 text-xs font-semibold text-white disabled:opacity-50 font-body"
            style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)" }}>
            {pending ? "Adding…" : "Add Task"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main KanbanBoard
───────────────────────────────────────────── */
export function KanbanBoard({
  projectId, tasks: initialTasks, members,
}: {
  projectId: string;
  tasks: Task[];
  members: { userId: string; user: Member }[];
}) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [overColumnId, setOverColumnId] = useState<TaskStatus | null>(null);
  const [addingTo, setAddingTo] = useState<TaskStatus | null>(null);
  const [, startTransition] = useTransition();

  // Keep internal state in sync with initialTasks when they change from server
  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const getColTasks = (s: TaskStatus) => tasks.filter((t) => t.status === s);

  /* Find which column an id belongs to (column id itself, or a task's column) */
  const resolveTargetColumn = (id: string): TaskStatus | null => {
    if (COLUMNS.some((c) => c.id === id)) return id as TaskStatus;
    const task = tasks.find((t) => t.id === id);
    return task?.status ?? null;
  };

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveTask(tasks.find((t) => t.id === active.id) ?? null);
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) { setOverColumnId(null); return; }
    const col = resolveTargetColumn(over.id as string);
    setOverColumnId(col);

    // Optimistic move during drag
    const draggedTask = tasks.find((t) => t.id === active.id);
    if (draggedTask && col && draggedTask.status !== col) {
      setTasks((prev) =>
        prev.map((t) => t.id === draggedTask.id ? { ...t, status: col } : t)
      );
    }
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveTask(null);
    setOverColumnId(null);

    if (!over) return;

    const taskId    = active.id as string;
    const targetCol = resolveTargetColumn(over.id as string);
    const draggedTask = tasks.find((t) => t.id === taskId);

    if (!draggedTask || !targetCol) return;

    // The optimistic state is already set; now persist to server
    startTransition(() => updateTaskStatus(taskId, targetCol, projectId));
  };

  const handleDragCancel = () => {
    // Revert optimistic state back to server state on cancel
    setTasks(initialTasks);
    setActiveTask(null);
    setOverColumnId(null);
  };

  const handleTaskDelete = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex gap-5 h-full">
        {COLUMNS.map((col) => {
          const colTasks = getColTasks(col.id);
          const isOver   = overColumnId === col.id;

          return (
            <div
              key={col.id}
              className={`flex flex-col rounded-2xl border ${col.border} min-w-[300px] max-w-[300px] p-4 transition-colors ${
                isOver ? col.glow : "bg-white/2"
              }`}
            >
              {/* Column header */}
              <div className="flex items-center gap-2 mb-4 shrink-0">
                <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                <span className="text-sm font-body font-semibold text-white">{col.label}</span>
                <span className="ml-auto text-xs text-white/30 font-body bg-white/5 rounded-full px-2 py-0.5">
                  {colTasks.length}
                </span>
              </div>

              {/* Drop zone + sortable tasks */}
              <SortableContext items={colTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                <DroppableColumn id={col.id} isOver={isOver}>
                  {colTasks.map((task) => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      projectId={projectId} 
                      onDelete={handleTaskDelete}
                    />
                  ))}
                </DroppableColumn>
              </SortableContext>

              {/* Add task button / inline form */}
              {addingTo === col.id ? (
                <CreateTaskForm
                  projectId={projectId}
                  status={col.id}
                  members={members}
                  onClose={() => setAddingTo(null)}
                />
              ) : (
                <button
                  onClick={() => setAddingTo(col.id)}
                  className="mt-3 shrink-0 flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-white/30 hover:text-white hover:bg-white/5 transition-all font-body w-full cursor-pointer"
                >
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  Add task
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating drag preview */}
      <DragOverlay dropAnimation={{ duration: 180, easing: "ease" }}>
        {activeTask && (
          <TaskCard 
            task={activeTask} 
            projectId={projectId} 
            overlay 
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}
