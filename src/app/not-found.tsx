"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground overflow-hidden px-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-destructive blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="relative z-10 text-center"
      >
        <h1 className="text-[150px] font-extrabold tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-br from-primary to-foreground/50 select-none">
          404
        </h1>
        <h2 className="mt-4 text-3xl font-bold tracking-tight">
          Page not found
        </h2>
        <p className="mt-4 text-muted-foreground text-lg max-w-md mx-auto">
          We couldn't find the page you're looking for. It might have been moved or deleted.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-10"
        >
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3 text-sm font-medium text-primary-foreground bg-primary rounded-full hover:bg-primary/90 transition-all hover:scale-105 shadow-lg"
          >
            Go back home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
