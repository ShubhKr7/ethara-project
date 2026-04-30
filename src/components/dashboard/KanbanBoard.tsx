"use client";

import { useState, useTransition, useEffect, useRef } from "react";
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
import { updateTaskStatus, createTask, updateTask } from "@/lib/actions/task.actions";
import { DeleteTaskButton } from "@/components/dashboard/DeleteTaskButton";
import { TaskStatus, TaskPriority } from "@prisma/client";
import { motion, AnimatePresence } from "framer-motion";

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

const COLUMNS: { id: TaskStatus; label: string; border: string; dot: string; bg: string }[] = [
  { id: "TODO",        label: "To Do",       border: "border-slate-400/20",  dot: "bg-slate-400",  bg: "bg-slate-400/5"  },
  { id: "IN_PROGRESS", label: "In Progress", border: "border-amber-400/20", dot: "bg-amber-400",  bg: "bg-amber-400/5"  },
  { id: "DONE",        label: "Done",        border: "border-green-400/20", dot: "bg-green-400",  bg: "bg-green-400/5"  },
];

const PRIORITY_STYLES: Record<TaskPriority, { label: string; cls: string; activeCls: string }> = {
  LOW:    { label: "Low",    cls: "text-blue-600  bg-blue-500/10  border-blue-500/20", activeCls: "bg-blue-500 text-white shadow-lg shadow-blue-500/30"  },
  MEDIUM: { label: "Medium", cls: "text-amber-600 bg-amber-500/10 border-amber-500/20", activeCls: "bg-amber-500 text-white shadow-lg shadow-amber-500/30" },
  HIGH:   { label: "High",   cls: "text-red-600   bg-red-500/10   border-red-500/20", activeCls: "bg-red-500 text-white shadow-lg shadow-red-500/30"   },
};

/* ─────────────────────────────────────────────
   Task Detail Drawer
───────────────────────────────────────────── */
function TaskDetailDrawer({
  task, projectId, members, onClose
}: {
  task: Task; projectId: string; members: { userId: string; user: Member }[]; onClose: () => void;
}) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [priority, setPriority] = useState(task.priority);
  const [dueDate, setDueDate] = useState(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "");
  const [isPending, startTransition] = useTransition();
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");

  const save = (updates: any) => {
    setSaveState("saving");
    startTransition(async () => {
      try {
        await updateTask(task.id, { ...updates, projectId });
        setSaveState("saved");
        setTimeout(() => setSaveState("idle"), 2000);
      } catch (err) {
        setSaveState("idle");
      }
    });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
      />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 h-full w-full max-w-lg bg-card border-l border-border shadow-2xl z-[70] flex flex-col"
      >
        <div className="p-8 flex-1 overflow-y-auto custom-scrollbar space-y-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Task Details</span>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <div className="space-y-2">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => save({ title })}
              className="w-full bg-transparent font-heading italic text-foreground text-4xl tracking-tight outline-none border-b-2 border-transparent focus:border-primary/20 transition-all pb-2"
              placeholder="Task Title"
            />
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-body">
              <span>Last updated {new Date().toLocaleDateString()}</span>
              {saveState !== "idle" && (
                <span className={`transition-all font-bold uppercase tracking-widest ml-2 ${saveState === "saving" ? "animate-pulse text-primary" : "text-green-500"}`}>
                  {saveState === "saving" ? "• Saving…" : "• Saved"}
                </span>
              )}
            </div>
          </div>

          <div className="grid gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Priority Level</label>
              <div className="flex gap-2">
                {(Object.keys(PRIORITY_STYLES) as TaskPriority[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => { setPriority(p); save({ priority: p }); }}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      priority === p ? PRIORITY_STYLES[p].activeCls : "border-border text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    {PRIORITY_STYLES[p].label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => { setDueDate(e.target.value); save({ dueDate: e.target.value || null }); }}
                className="w-full rounded-2xl border border-border bg-background px-5 py-3.5 text-sm text-foreground focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none font-body font-bold transition-all"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() => save({ description })}
                rows={6}
                placeholder="Add more details about this task…"
                className="w-full rounded-2xl border border-border bg-background px-5 py-4 text-sm text-foreground focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none font-body leading-relaxed transition-all resize-none placeholder-muted-foreground/30"
              />
            </div>
          </div>
        </div>

        <div className="p-8 bg-muted/20 border-t border-border">
          <button 
            onClick={onClose}
            className="w-full py-4 rounded-2xl font-bold text-sm bg-foreground text-background hover:opacity-90 transition-all shadow-xl"
          >
            Done Editing
          </button>
        </div>
      </motion.div>
    </>
  );
}

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
      className={`flex flex-col gap-3 flex-1 min-h-[150px] rounded-2xl transition-all duration-200 ${
        isOver ? "bg-primary/5 ring-2 ring-primary/20 scale-[0.99]" : ""
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
  onEdit,
  overlay = false 
}: { 
  task: Task; 
  projectId: string; 
  onDelete?: (id: string) => void;
  onEdit?: (task: Task) => void;
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
      onClick={() => !isDragging && onEdit?.(task)}
      className={`group rounded-2xl border border-border bg-card p-5 cursor-grab active:cursor-grabbing
        hover:border-primary/30 hover:shadow-lg transition-all select-none shadow-sm
        ${overlay ? "shadow-2xl rotate-[1.5deg] border-primary/40 bg-card ring-2 ring-primary/10" : ""}`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <p className="text-sm font-body text-foreground font-bold leading-snug flex-1 group-hover:text-primary transition-colors">{task.title}</p>
        {!overlay && (
          <div onClick={(e) => e.stopPropagation()}>
            <DeleteTaskButton 
              taskId={task.id} 
              projectId={projectId} 
              onDeleteSuccess={() => onDelete?.(task.id)} 
            />
          </div>
        )}
      </div>

      {task.description && (
        <p className="text-xs text-muted-foreground font-body mb-4 line-clamp-2 leading-relaxed">{task.description}</p>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-[10px] font-bold uppercase tracking-tight border rounded-full px-2.5 py-1 ${p.cls}`}>
          {p.label}
        </span>
        {task.dueDate && (
          <span className={`text-[10px] font-bold ml-auto uppercase tracking-wider ${overdue ? "text-red-500" : "text-muted-foreground/50"}`}>
            {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        )}
        {task.assignee && (
          <div
            className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 border-2 border-card flex items-center justify-center text-[9px] font-bold text-white shadow-sm"
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
    <div className="mt-2 rounded-2xl border border-primary/20 bg-primary/5 p-4 shadow-inner">
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="title" required autoFocus placeholder="What needs to be done?"
          className="block w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground/40 focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none font-body font-bold transition-all"
        />
        <textarea
          name="description" placeholder="Description (optional)"
          rows={2}
          className="block w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground/40 focus:border-primary focus:outline-none font-body transition-all resize-none"
        />
        <div className="flex gap-2">
          <select name="priority" defaultValue="MEDIUM"
            className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none font-body font-bold cursor-pointer transition-all">
            <option value="LOW">Low Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="HIGH">High Priority</option>
          </select>
          <input type="date" name="dueDate"
            className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none font-body font-bold transition-all" />
        </div>
        {members.length > 1 && (
          <select name="assigneeId"
            className="block w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none font-body font-bold cursor-pointer transition-all">
            <option value="">Unassigned</option>
            {members.map((m) => <option key={m.userId} value={m.userId}>{m.user.name}</option>)}
          </select>
        )}
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose}
            className="flex-1 rounded-xl border border-border py-2.5 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all font-body">
            Cancel
          </button>
          <button type="submit" disabled={pending}
            className="flex-1 rounded-xl py-2.5 text-xs font-bold text-white disabled:opacity-50 font-body shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)" }}>
            {pending ? "Adding…" : "Create Task"}
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
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const getColTasks = (s: TaskStatus) => tasks.filter((t) => t.status === s);

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

    startTransition(() => updateTaskStatus(taskId, targetCol, projectId));
  };

  const handleDragCancel = () => {
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
      <div className="flex gap-6 h-full pb-8">
        {COLUMNS.map((col) => {
          const colTasks = getColTasks(col.id);
          const isOver   = overColumnId === col.id;

          return (
            <div
              key={col.id}
              className={`flex flex-col rounded-[2rem] border ${col.border} min-w-[320px] max-w-[320px] p-6 transition-all duration-300 ${
                isOver ? "bg-muted/40 shadow-inner" : "bg-muted/10"
              }`}
            >
              <div className="flex items-center gap-3 mb-6 shrink-0">
                <span className={`w-2.5 h-2.5 rounded-full shadow-sm ${col.dot}`} />
                <span className="text-sm font-bold text-foreground uppercase tracking-[0.1em]">{col.label}</span>
                <span className="ml-auto text-[10px] font-bold text-muted-foreground bg-card shadow-sm border border-border rounded-full px-2.5 py-0.5">
                  {colTasks.length}
                </span>
              </div>

              <SortableContext items={colTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                <DroppableColumn id={col.id} isOver={isOver}>
                  {colTasks.map((task) => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      projectId={projectId} 
                      onDelete={handleTaskDelete}
                      onEdit={setEditingTask}
                    />
                  ))}
                </DroppableColumn>
              </SortableContext>

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
                  className="mt-4 shrink-0 flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-xs font-bold text-muted-foreground/60 hover:text-primary hover:bg-card hover:shadow-md hover:border-primary/10 border border-transparent transition-all font-body w-full cursor-pointer group"
                >
                  <svg className="w-4 h-4 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  Add a new task
                </button>
              )}
            </div>
          );
        })}
      </div>

      <DragOverlay dropAnimation={{ duration: 200, easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)" }}>
        {activeTask && (
          <TaskCard 
            task={activeTask} 
            projectId={projectId} 
            overlay 
          />
        )}
      </DragOverlay>

      <AnimatePresence>
        {editingTask && (
          <TaskDetailDrawer
            task={editingTask}
            projectId={projectId}
            members={members}
            onClose={() => setEditingTask(null)}
          />
        )}
      </AnimatePresence>
    </DndContext>
  );
}
