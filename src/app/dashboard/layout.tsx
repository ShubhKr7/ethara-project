import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { getMyProjects } from "@/lib/actions/project.actions";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const projects = await getMyProjects();

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground transition-colors duration-300">
      <Sidebar user={session.user} projects={projects} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
