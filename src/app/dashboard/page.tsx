import { Suspense } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  DashboardStats, 
  StatsSkeleton, 
  RecentProjects, 
  ProjectsSkeleton 
} from "@/components/dashboard/DashboardShell";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const firstName = session.user.name?.split(" ")[0] ?? "there";

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header - Renders Instantly */}
      <div className="mb-10">
        <p className="text-muted-foreground text-sm font-body mb-1">
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>
        <h1 className="font-heading italic text-foreground text-5xl md:text-6xl tracking-tight">
          Good to see you, {firstName}.
        </h1>
      </div>

      {/* Stats - Streams in independently */}
      <Suspense fallback={<StatsSkeleton />}>
        <DashboardStats />
      </Suspense>

      {/* Recent Projects Header - Renders Instantly */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-white font-body font-semibold text-lg">Recent Projects</h2>
        <Link href="/dashboard/projects" className="text-sm text-white/40 hover:text-white transition-colors font-body">
          View all →
        </Link>
      </div>

      {/* Projects List - Streams in independently */}
      <Suspense fallback={<ProjectsSkeleton />}>
        <RecentProjects />
      </Suspense>
    </div>
  );
}
