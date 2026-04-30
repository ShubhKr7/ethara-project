"use client";

import { ThemeProvider } from "next-themes";
import QueryProvider from "./query-provider";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryProvider>
        {children}
      </QueryProvider>
    </ThemeProvider>
  );
}
