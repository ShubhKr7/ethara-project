"use client";

import { useState, useRef, useTransition } from "react";
import { updateProject } from "@/lib/actions/project.actions";

type SaveState = "idle" | "saving" | "saved" | "error";

function SaveIndicator({ state }: { state: SaveState }) {
  if (state === "idle") return null;
  return (
    <span
      className={`text-[11px] font-body transition-all ${
        state === "saving" ? "text-white/30 animate-pulse" :
        state === "saved"  ? "text-green-400" :
        "text-red-400"
      }`}
    >
      {state === "saving" ? "Saving…" : state === "saved" ? "✓ Saved" : "Failed to save"}
    </span>
  );
}

interface EditableProjectHeaderProps {
  projectId: string;
  initialName: string;
  initialDescription: string | null;
}

export function EditableProjectHeader({ projectId, initialName, initialDescription }: EditableProjectHeaderProps) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription ?? "");
  const [editingName, setEditingName] = useState(false);
  const [editingDesc, setEditingDesc] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");

  const nameRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);
  const [, startTransition] = useTransition();

  const save = (overrideName?: string, overrideDesc?: string) => {
    const newName = overrideName ?? name;
    const newDesc = overrideDesc ?? description;

    // Don't save if nothing changed
    if (newName === initialName && newDesc === (initialDescription ?? "")) return;
    if (!newName.trim()) return;

    setSaveState("saving");
    startTransition(async () => {
      try {
        await updateProject(projectId, { name: newName, description: newDesc });
        setSaveState("saved");
        setTimeout(() => setSaveState("idle"), 2000);
      } catch {
        setSaveState("error");
        setTimeout(() => setSaveState("idle"), 3000);
      }
    });
  };

  /* ── Name ── */
  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
    if (e.key === "Escape") {
      setName(initialName);
      setEditingName(false);
    }
  };

  const handleNameBlur = () => {
    setEditingName(false);
    if (!name.trim()) { setName(initialName); return; }
    save(name, description);
  };

  /* ── Description ── */
  const handleDescKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.blur();
    }
    if (e.key === "Escape") {
      setDescription(initialDescription ?? "");
      setEditingDesc(false);
    }
  };

  const handleDescBlur = () => {
    setEditingDesc(false);
    save(name, description);
  };

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-3 mb-1">
        {/* Editable title */}
        {editingName ? (
          <input
            ref={nameRef}
            autoFocus
            value={name}
            maxLength={100}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleNameBlur}
            onKeyDown={handleNameKeyDown}
            className="font-heading italic text-white text-3xl md:text-4xl tracking-tight bg-transparent border-b-2 border-violet-500/60 outline-none w-full max-w-xl leading-tight pb-0.5"
          />
        ) : (
          <button
            onClick={() => { setEditingName(true); setTimeout(() => nameRef.current?.select(), 10); }}
            className="group flex items-center gap-2 text-left"
            title="Click to edit"
          >
            <h1 className="font-heading italic text-white text-3xl md:text-4xl tracking-tight group-hover:text-violet-300 transition-colors">
              {name}
            </h1>
            <svg
              className="w-4 h-4 text-white/20 group-hover:text-violet-400 transition-colors shrink-0 mt-1"
              fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
            >
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        )}
        <SaveIndicator state={saveState} />
      </div>

      {/* Editable description */}
      {editingDesc ? (
        <textarea
          ref={descRef}
          autoFocus
          value={description}
          maxLength={500}
          rows={2}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={handleDescBlur}
          onKeyDown={handleDescKeyDown}
          placeholder="Add a description… (Enter to save, Shift+Enter for newline)"
          className="block w-full max-w-lg text-sm font-body text-white/70 bg-transparent border-b border-white/20 outline-none resize-none placeholder-white/20 leading-snug"
        />
      ) : (
        <button
          onClick={() => { setEditingDesc(true); setTimeout(() => descRef.current?.focus(), 10); }}
          className="group flex items-start gap-1.5 text-left max-w-lg"
          title="Click to edit description"
        >
          <span className={`text-sm font-body leading-snug transition-colors ${
            description ? "text-white/40 group-hover:text-white/60" : "text-white/20 group-hover:text-white/40 italic"
          }`}>
            {description || "Add a description…"}
          </span>
          <svg
            className="w-3 h-3 text-white/0 group-hover:text-white/30 transition-colors shrink-0 mt-0.5"
            fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
          >
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
      )}
    </div>
  );
}
