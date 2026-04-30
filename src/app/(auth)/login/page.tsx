"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion, type MotionProps } from "framer-motion";

const fadeUp = (delay = 0): MotionProps => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay },
});

const fadeIn = (delay = 0): MotionProps => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.7, ease: "easeOut", delay },
});

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await signIn("credentials", { redirect: false, email, password });
      if (res?.error) {
        setError("Invalid email or password");
        setLoading(false);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center p-4 overflow-hidden bg-background"
      style={{ background: "radial-gradient(ellipse at 80% 50%, var(--auth-bg-1) 0%, var(--auth-bg-2) 40%, var(--auth-bg-3) 100%)" }}
    >
      {/* Animated ambient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div {...fadeIn(0)} className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full blur-[120px]" style={{ background: "radial-gradient(circle, var(--auth-orb-2), transparent 70%)", animation: "orbPulse 8s ease-in-out infinite" }} />
        <motion.div {...fadeIn(0.3)} className="absolute -bottom-48 -left-24 w-[600px] h-[600px] rounded-full blur-[140px]" style={{ background: "radial-gradient(circle, var(--auth-orb-1), transparent 70%)", animation: "orbPulse 10s ease-in-out infinite 2s" }} />
        <motion.div {...fadeIn(0.6)} className="absolute top-1/3 right-1/3 w-[300px] h-[300px] rounded-full blur-[80px]" style={{ background: "radial-gradient(circle, var(--auth-orb-3), transparent 70%)", animation: "orbPulse 12s ease-in-out infinite 4s" }} />
      </div>

      {/* Grid overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] dark:opacity-[0.03]" style={{ backgroundImage: "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      {/* Back to home */}
      <motion.div {...fadeIn(0.1)} className="absolute top-6 left-6 z-20">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-full flex items-center justify-center border border-foreground/15 bg-foreground/5 backdrop-blur-md group-hover:bg-foreground/10 transition-colors">
            <span className="font-heading italic text-foreground text-lg leading-none">e</span>
          </div>
          <span className="text-foreground/50 text-xs font-body tracking-wider group-hover:text-foreground/80 transition-colors hidden sm:block">ethara</span>
        </Link>
      </motion.div>

      {/* Theme toggle */}
      <motion.div {...fadeIn(0.1)} className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </motion.div>

      {/* Glass card */}
      <div className="relative z-10 w-full max-w-[420px]">
        {/* Card glow */}
        <motion.div {...fadeIn(0.2)} className="absolute -inset-px rounded-[1.75rem] opacity-50 blur-[2px]" style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.4) 0%, rgba(124,58,237,0.2) 50%, rgba(6,182,212,0.3) 100%)" }} />

        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="relative rounded-[1.75rem] border border-foreground/10 p-8 md:p-10 shadow-2xl"
          style={{ background: "linear-gradient(135deg, rgba(var(--glass-base), 0.07) 0%, rgba(var(--glass-base), 0.03) 100%)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div {...fadeUp(0.3)} className="inline-flex items-center gap-2 bg-foreground/5 border border-foreground/10 rounded-full px-3 py-1 mb-5">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-foreground/60 text-[11px] font-body tracking-widest uppercase">Welcome Back</span>
            </motion.div>
            <motion.h1 {...fadeUp(0.38)} className="font-heading italic text-foreground text-4xl md:text-5xl tracking-tight leading-none mb-3">
              Sign in
            </motion.h1>
            <motion.p {...fadeUp(0.44)} className="text-foreground/50 text-sm font-body font-light">
              Continue to your Ethara workspace
            </motion.p>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <motion.div {...fadeUp(0.5)} className="space-y-1.5">
              <label className="block text-[11px] font-body font-semibold text-foreground/50 uppercase tracking-[0.1em]">Email address</label>
              <input
                id="email" name="email" type="email" required autoComplete="email"
                className="block w-full rounded-xl border border-foreground/10 bg-foreground/5 px-4 py-3 text-sm text-foreground placeholder-foreground/25 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-body"
                placeholder="you@example.com"
              />
            </motion.div>

            <motion.div {...fadeUp(0.56)} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-body font-semibold text-foreground/50 uppercase tracking-[0.1em]">Password</label>
                <Link href="#" className="text-[11px] text-blue-500/70 hover:text-blue-500 transition-colors font-body">Forgot?</Link>
              </div>
              <input
                id="password" name="password" type="password" required autoComplete="current-password"
                className="block w-full rounded-xl border border-foreground/10 bg-foreground/5 px-4 py-3 text-sm text-foreground placeholder-foreground/25 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-body"
                placeholder="••••••••"
              />
            </motion.div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5">
                <svg className="w-4 h-4 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                <span className="text-sm text-red-500 font-body">{error}</span>
              </motion.div>
            )}

            <motion.button
              {...fadeUp(0.62)}
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              className="relative w-full mt-2 rounded-xl px-4 py-3.5 text-sm font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 overflow-hidden group"
              style={{ background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)" }}
            >
              <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors rounded-xl" />
              <span className="relative">{loading ? "Signing in…" : "Sign in"}</span>
              {!loading && (
                <svg className="relative w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              )}
            </motion.button>
          </form>

          <motion.div {...fadeUp(0.68)} className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-foreground/10" />
            <span className="text-foreground/30 text-xs font-body">or</span>
            <div className="flex-1 h-px bg-foreground/10" />
          </motion.div>

          <motion.p {...fadeUp(0.72)} className="text-center text-sm text-foreground/40 font-body">
            New to Ethara?{" "}
            <Link href="/signup" className="text-blue-500 hover:text-blue-600 transition-colors font-medium">
              Create an account →
            </Link>
          </motion.p>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes orbPulse {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.15); opacity: 0.35; }
        }
      `}</style>
    </div>
  );
}
