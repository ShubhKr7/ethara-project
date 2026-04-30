"use client";

import { useState, useTransition } from "react";
import { signOut } from "next-auth/react";
import { ThemeToggle } from "@/components/theme-toggle";
import { updateProfile } from "@/lib/actions/user.actions";
import { motion, AnimatePresence, type HTMLMotionProps } from "framer-motion";

const fadeUp = (delay = 0): HTMLMotionProps<"div"> => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { 
    duration: 0.5, 
    ease: [0.22, 1, 0.36, 1], 
    delay 
  },
});

interface ProfileFormProps {
  user: {
    id: string;
    name: string | null;
    email: string | null;
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [name, setName] = useState(user.name ?? "");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (name === user.name) return;

    startTransition(async () => {
      const res = await updateProfile({ name });
      if (res.error) {
        setMessage({ type: "error", text: res.error });
      } else {
        setMessage({ type: "success", text: "Profile updated successfully!" });
      }
    });
  };

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Profile Header */}
      <motion.div 
        {...fadeUp(0)}
        className="flex items-center gap-6 p-8 rounded-3xl border border-border bg-card shadow-sm"
      >
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 15, delay: 0.2 }}
          className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-2xl font-bold text-white shadow-xl"
        >
          {name?.[0]?.toUpperCase() ?? "?"}
        </motion.div>
        <div>
          <motion.h2 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-heading italic text-foreground tracking-tight"
          >
            {name || "Your Profile"}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground font-body text-sm"
          >
            {user.email}
          </motion.p>
        </div>
      </motion.div>

      <div className="grid gap-6">
        {/* Settings Card */}
        <motion.div 
          {...fadeUp(0.1)}
          className="rounded-3xl border border-border bg-card p-8 space-y-6 shadow-sm"
        >
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-body font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Username / Display Name</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 rounded-2xl border border-input bg-background px-5 py-3.5 text-foreground placeholder-muted-foreground/30 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all font-body"
                  placeholder="Enter your name"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isPending || name === user.name}
                  className="px-6 rounded-2xl font-body font-semibold text-sm text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20"
                  style={{ background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)" }}
                >
                  {isPending ? "Updating..." : "Update"}
                </motion.button>
              </div>
              <AnimatePresence>
                {message && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`text-xs mt-2 ml-1 font-body overflow-hidden ${message.type === "success" ? "text-green-600" : "text-red-600"}`}
                  >
                    {message.text}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-body font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Email Address (Read-only)</label>
              <div className="rounded-2xl border border-border bg-muted/30 px-5 py-3.5 text-muted-foreground font-body cursor-not-allowed">
                {user.email}
              </div>
            </div>
          </form>

          <div className="pt-6 border-t border-border flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground font-body font-medium">Appearance</p>
              <p className="text-xs text-muted-foreground font-body">Toggle between light and dark themes</p>
            </div>
            <ThemeToggle />
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div 
          {...fadeUp(0.2)}
          className="rounded-3xl border border-red-500/10 bg-red-500/5 p-8"
        >
          <h3 className="text-red-500 font-body font-semibold mb-4 flex items-center gap-2">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 17c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Account Actions
          </h3>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-red-500 text-white font-body font-bold text-sm hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20 cursor-pointer"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
