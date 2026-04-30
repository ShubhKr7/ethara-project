"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { deleteTask } from "@/lib/actions/task.actions";

type Stage = "idle" | "confirming" | "loading" | "success";

interface DeleteTaskButtonProps {
  taskId: string;
  projectId: string;
  onDeleteSuccess: () => void;
}

export function DeleteTaskButton({ taskId, projectId, onDeleteSuccess }: DeleteTaskButtonProps) {
  const [stage, setStage] = useState<Stage>("idle");

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setStage("loading");
    try {
      await deleteTask(taskId, projectId);
      setStage("success");
      // Show success for a short time then remove from UI
      setTimeout(() => {
        onDeleteSuccess();
        setStage("idle");
      }, 1000);
    } catch {
      setStage("idle");
    }
  };

  return (
    <>
      <button
        onClick={(e) => { e.stopPropagation(); setStage("confirming"); }}
        onPointerDown={(e) => e.stopPropagation()}
        className="opacity-0 group-hover:opacity-100 transition-all text-muted-foreground/30 hover:text-red-500 shrink-0 cursor-pointer p-1 rounded-lg hover:bg-red-500/10"
      >
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      {/* Overlay: loading or success */}
      <AnimatePresence>
        {(stage === "loading" || stage === "success") && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/80 backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <AnimatePresence mode="wait">
              {stage === "loading" && (
                <motion.div
                  key="loading"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="relative w-12 h-12">
                    <div className="absolute inset-0 rounded-full border-2 border-foreground/10" />
                    <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-red-500 animate-spin" />
                  </div>
                  <p className="text-foreground/70 font-body font-bold text-sm uppercase tracking-widest">Removing task…</p>
                </motion.div>
              )}

              {stage === "success" && (
                <motion.div
                  key="success"
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="relative w-14 h-14">
                    <svg viewBox="0 0 64 64" className="w-full h-full">
                      <motion.circle
                        cx="32" cy="32" r="28"
                        fill="none" stroke="rgba(239,68,68,0.2)" strokeWidth="3"
                      />
                      <motion.circle
                        cx="32" cy="32" r="28"
                        fill="none" stroke="#ef4444" strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={176}
                        initial={{ strokeDashoffset: 176 }}
                        animate={{ strokeDashoffset: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                      <motion.polyline
                        points="20,32 28,42 44,22"
                        fill="none" stroke="#ef4444" strokeWidth="3.5"
                        strokeLinecap="round" strokeLinejoin="round"
                        strokeDasharray={40}
                        initial={{ strokeDashoffset: 40 }}
                        animate={{ strokeDashoffset: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut", delay: 0.4 }}
                      />
                    </svg>
                  </div>
                  <p className="text-foreground font-heading italic text-xl">Deleted</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation modal */}
      <AnimatePresence>
        {stage === "confirming" && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md"
              onClick={(e) => { e.stopPropagation(); setStage("idle"); }}
            />
            <motion.div
              key="dialog"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div
                className="pointer-events-auto w-full max-w-xs rounded-3xl border border-border p-8 shadow-2xl bg-card"
              >
                <h3 className="font-heading italic text-foreground text-2xl mb-3">Delete task?</h3>
                <p className="text-muted-foreground text-sm font-body leading-relaxed mb-8">
                  Are you sure you want to remove this task?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); setStage("idle"); }}
                    className="flex-1 cursor-pointer rounded-2xl border border-border py-3 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all font-body"
                  >
                    No
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 cursor-pointer rounded-2xl py-3 text-xs font-bold text-white hover:opacity-90 transition-all font-body shadow-lg shadow-red-500/20"
                    style={{ background: "linear-gradient(135deg, #dc2626, #b91c1c)" }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
