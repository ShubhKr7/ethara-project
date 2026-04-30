"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { deleteProject } from "@/lib/actions/project.actions";
import { useRouter } from "next/navigation";

type Stage = "idle" | "confirming" | "loading" | "success";

export function DeleteProjectButton({ projectId }: { projectId: string }) {
  const [stage, setStage] = useState<Stage>("idle");
  const router = useRouter();

  const handleDelete = async () => {
    setStage("loading");
    try {
      await deleteProject(projectId);
      setStage("success");
      setTimeout(() => router.push("/dashboard/projects"), 1400);
    } catch {
      setStage("idle");
    }
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setStage("confirming")}
        className="cursor-pointer rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/15 hover:border-red-500/40 transition-all font-body"
      >
        Delete project
      </button>

      {/* Overlay: loading or success */}
      <AnimatePresence>
        {(stage === "loading" || stage === "success") && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
            style={{ background: "rgba(8, 8, 16, 0.92)", backdropFilter: "blur(12px)" }}
          >
            <AnimatePresence mode="wait">
              {stage === "loading" && (
                <motion.div
                  key="loading"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="relative w-14 h-14">
                    <div className="absolute inset-0 rounded-full border-2 border-white/10" />
                    <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-red-400 animate-spin" />
                  </div>
                  <p className="text-white/70 font-body text-sm">Deleting project…</p>
                </motion.div>
              )}

              {stage === "success" && (
                <motion.div
                  key="success"
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="flex flex-col items-center gap-4"
                >
                  {/* Animated checkmark circle */}
                  <div className="relative w-16 h-16">
                    <svg viewBox="0 0 64 64" className="w-full h-full">
                      <motion.circle
                        cx="32" cy="32" r="28"
                        fill="none" stroke="rgba(239,68,68,0.25)" strokeWidth="3"
                      />
                      <motion.circle
                        cx="32" cy="32" r="28"
                        fill="none" stroke="#ef4444" strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={176}
                        initial={{ strokeDashoffset: 176 }}
                        animate={{ strokeDashoffset: 0 }}
                        transition={{ duration: 0.55, ease: "easeOut" }}
                      />
                      <motion.polyline
                        points="20,32 28,42 44,22"
                        fill="none" stroke="#ef4444" strokeWidth="3.5"
                        strokeLinecap="round" strokeLinejoin="round"
                        strokeDasharray={40}
                        initial={{ strokeDashoffset: 40 }}
                        animate={{ strokeDashoffset: 0 }}
                        transition={{ duration: 0.35, ease: "easeOut", delay: 0.45 }}
                      />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-body font-semibold text-base">Project deleted</p>
                    <p className="text-white/40 font-body text-sm mt-1">Redirecting you back…</p>
                  </div>
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
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50"
              style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
              onClick={() => setStage("idle")}
            />
            <motion.div
              key="dialog"
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div
                className="pointer-events-auto w-full max-w-sm rounded-2xl border border-white/10 p-7 shadow-2xl"
                style={{ background: "linear-gradient(135deg, rgba(20,10,30,0.98) 0%, rgba(10,10,20,0.98) 100%)", backdropFilter: "blur(24px)" }}
              >
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" className="text-red-400">
                    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10 11v6M14 11v6" strokeLinecap="round" />
                  </svg>
                </div>
                <h2 className="font-heading italic text-white text-2xl mb-2">Delete project?</h2>
                <p className="text-white/50 text-sm font-body leading-relaxed mb-7">
                  This will permanently delete the project along with all its tasks and member assignments. This action{" "}
                  <span className="text-red-400 font-medium">cannot be undone</span>.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setStage("idle")}
                    className="flex-1 cursor-pointer rounded-xl border border-white/10 py-2.5 text-sm font-semibold text-white/60 hover:text-white hover:bg-white/5 transition-all font-body"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 cursor-pointer rounded-xl py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-all font-body"
                    style={{ background: "linear-gradient(135deg, #dc2626, #b91c1c)" }}
                  >
                    Yes, delete it
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
