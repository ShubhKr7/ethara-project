import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    redirect("/login");
  }

  const initials = session.user.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "SA";

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="flex items-center justify-between px-6 py-4">
          <Link href="/superadmin" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center group-hover:scale-105 transition-transform shadow-md">
              <span className="font-heading italic text-lg leading-none">e</span>
            </div>
            <span className="font-heading font-bold tracking-tight text-lg">Super Admin</span>
          </Link>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="flex items-center gap-3 pl-4 border-l border-border">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold leading-none">{session.user.name}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Super Admin</p>
              </div>
              <Link href="/superadmin/profile" className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center text-xs font-bold text-white shadow-md hover:scale-110 transition-transform">
                {initials}
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
