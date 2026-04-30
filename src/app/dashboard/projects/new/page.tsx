"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createProject } from "@/lib/actions/project.actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Stage = "idle" | "loading" | "success";

export default function NewProjectPage() {
  const [stage, setStage] = useState<Stage>("idle");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setStage("loading");
    try {
      const result = await createProject(formData);
      setStage("success");
      setTimeout(() => router.push(`/dashboard/projects/${result.id}`), 1400);
    } catch {
      setStage("idle");
    }
  };

  return (
    <>
      {/* Loading / success overlay */}
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
                    <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-violet-400 animate-spin" />
                  </div>
                  <p className="text-white/70 font-body text-sm">Creating project…</p>
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
                        fill="none" stroke="rgba(124,58,237,0.25)" strokeWidth="3"
                      />
                      <motion.circle
                        cx="32" cy="32" r="28"
                        fill="none" stroke="#7c3aed" strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={176}
                        initial={{ strokeDashoffset: 176 }}
                        animate={{ strokeDashoffset: 0 }}
                        transition={{ duration: 0.55, ease: "easeOut" }}
                      />
                      <motion.polyline
                        points="20,32 28,42 44,22"
                        fill="none" stroke="#7c3aed" strokeWidth="3.5"
                        strokeLinecap="round" strokeLinejoin="round"
                        strokeDasharray={40}
                        initial={{ strokeDashoffset: 40 }}
                        animate={{ strokeDashoffset: 0 }}
                        transition={{ duration: 0.35, ease: "easeOut", delay: 0.45 }}
                      />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-body font-semibold text-base">Project created!</p>
                    <p className="text-white/40 font-body text-sm mt-1">Taking you to the board…</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      <div className="p-8 max-w-xl mx-auto">
        <div className="mb-8">
          <Link
            href="/dashboard/projects"
            className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors font-body mb-4"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Back to Projects
          </Link>
          <h1 className="font-heading italic text-white text-4xl tracking-tight">New Project</h1>
          <p className="text-white/40 text-sm font-body mt-1">Set up your project in seconds.</p>
        </div>

        <div className="rounded-2xl border border-white/8 bg-white/3 p-8 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-xs font-body font-semibold text-white/50 uppercase tracking-widest mb-2">
                Project Name <span className="text-red-400">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoFocus
                maxLength={100}
                disabled={stage !== "idle"}
                className="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/25 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all font-body disabled:opacity-50"
                placeholder="e.g. Ethara Dashboard Redesign"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-xs font-body font-semibold text-white/50 uppercase tracking-widest mb-2">
                Description <span className="text-white/25">(optional)</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                maxLength={500}
                disabled={stage !== "idle"}
                className="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/25 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all font-body resize-none disabled:opacity-50"
                placeholder="What is this project about?"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Link
                href="/dashboard/projects"
                className="flex-1 text-center rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-white/60 hover:text-white hover:bg-white/5 transition-all font-body"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={stage !== "idle"}
                className="flex-1 relative cursor-pointer rounded-xl px-4 py-3 text-sm font-semibold text-white hover:scale-[1.01] active:scale-[0.99] transition-transform overflow-hidden group disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{ background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)" }}
              >
                <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors rounded-xl" />
                <span className="relative">Create Project →</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
