"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Session } from "next-auth";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  user: Session["user"];
  projects: any[];
}

export function Sidebar({ user, projects }: SidebarProps) {
  const pathname = usePathname();
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(true);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const isProjectsActive = pathname === "/dashboard/projects" || pathname.startsWith("/dashboard/projects/");

  return (
    <aside className="flex flex-col w-64 shrink-0 h-screen border-r border-border bg-muted/20 backdrop-blur-xl transition-all duration-300">
      {/* Logo */}
      <div className="px-7 py-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-foreground text-background flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg">
            <span className="font-heading italic text-xl leading-none">e</span>
          </div>
          <span className="text-foreground font-heading italic text-xl tracking-tight">ethara</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-2 space-y-1 overflow-hidden flex flex-col">
        <p className="px-4 mb-4 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.25em] opacity-60">Workspace</p>
        
        {/* Overview Link */}
        <Link
          href="/dashboard"
          className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-body font-bold transition-all group relative overflow-hidden ${
            pathname === "/dashboard"
              ? "bg-card text-foreground shadow-sm ring-1 ring-border"
              : "text-muted-foreground hover:text-foreground hover:bg-card/40"
          }`}
        >
          <span className={`transition-colors ${pathname === "/dashboard" ? "text-primary" : "text-muted-foreground/50 group-hover:text-muted-foreground"}`}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
          </span>
          Overview
          {pathname === "/dashboard" && (
            <motion.div layoutId="nav-glow" className="absolute inset-0 bg-primary/5 pointer-events-none" />
          )}
        </Link>

        {/* Projects Main Link + Toggle */}
        <div className="space-y-1">
          <div className={`group flex items-center rounded-2xl transition-all relative overflow-hidden ${
            isProjectsActive && !pathname.includes("/dashboard/projects/")
              ? "bg-card text-foreground shadow-sm ring-1 ring-border"
              : "text-muted-foreground hover:bg-card/40"
          }`}>
            <Link
              href="/dashboard/projects"
              className="flex-1 flex items-center gap-3.5 px-4 py-3 text-sm font-body font-bold transition-colors group-hover:text-foreground"
            >
              <span className={`transition-colors ${isProjectsActive ? "text-primary" : "text-muted-foreground/50 group-hover:text-muted-foreground"}`}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M3 7a2 2 0 012-2h3.5l2 2H19a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                </svg>
              </span>
              Projects
            </Link>
            <button 
              onClick={(e) => { e.preventDefault(); setIsProjectsExpanded(!isProjectsExpanded); }}
              className="px-3 py-3 h-full hover:text-foreground transition-colors cursor-pointer z-10"
            >
              <motion.svg 
                animate={{ rotate: isProjectsExpanded ? 0 : -90 }}
                className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100" 
                fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" />
              </motion.svg>
            </button>
            {isProjectsActive && !pathname.includes("/dashboard/projects/") && (
              <motion.div layoutId="nav-glow" className="absolute inset-0 bg-primary/5 pointer-events-none" />
            )}
          </div>

          <AnimatePresence initial={false}>
            {isProjectsExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden flex flex-col pl-4"
              >
                <div className="space-y-1 mt-1 border-l border-border/30 ml-6 pr-1 pb-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                  {projects.length === 0 ? (
                    <div className="pl-6 py-3 text-[11px] text-muted-foreground/40 font-body italic">
                      No active projects
                    </div>
                  ) : (
                    projects.map((project, index) => {
                      const isActive = pathname === `/dashboard/projects/${project.id}`;
                      return (
                        <motion.div
                          key={project.id}
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.05, duration: 0.3 }}
                        >
                          <Link
                            href={`/dashboard/projects/${project.id}`}
                            className={`flex items-center gap-3 pl-6 pr-3 py-2 rounded-xl text-[13px] font-body transition-all group relative ${
                              isActive
                                ? "text-primary font-bold bg-primary/5"
                                : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.03]"
                            }`}
                          >
                            {/* Decorative dot */}
                            <div className={`w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-300 ${
                              isActive ? "bg-primary scale-125 shadow-[0_0_8px_rgba(124,58,237,0.6)]" : "bg-muted-foreground/20 group-hover:bg-muted-foreground/40"
                            }`} />
                            
                            <span className={`truncate ${isActive ? "" : "opacity-70 group-hover:opacity-100"}`}>
                              {project.name}
                            </span>

                            {isActive && (
                              <motion.div 
                                layoutId="project-active-bar"
                                className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-primary rounded-full"
                              />
                            )}
                          </Link>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* User footer */}
      <div className="px-4 py-6 border-t border-border bg-card/30 shrink-0">
        <Link 
          href="/dashboard/profile"
          className={`flex items-center gap-3 px-3 py-3 rounded-2xl transition-all group relative overflow-hidden ${
            pathname === "/dashboard/profile" 
              ? "bg-card shadow-md ring-1 ring-primary/10" 
              : "hover:bg-card/50"
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-lg group-hover:scale-110 transition-transform">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-foreground font-body font-bold truncate group-hover:text-primary transition-colors">
              {user?.name ?? "User"}
            </p>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Settings</p>
          </div>
          <svg className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M9 18l6-6-6-6" />
          </svg>
          {pathname === "/dashboard/profile" && (
            <motion.div layoutId="nav-glow" className="absolute inset-0 bg-primary/5 pointer-events-none" />
          )}
        </Link>
      </div>
    </aside>
  );
}
