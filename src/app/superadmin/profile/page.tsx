import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/dashboard/ProfileForm";
import Link from "next/link";

export default async function SuperAdminProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="p-8 md:p-12 max-w-5xl mx-auto">
      <div className="mb-6">
        <Link href="/superadmin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>
      </div>
      <div className="mb-10">
        <h1 className="font-heading italic text-foreground text-4xl md:text-5xl tracking-tight">Super Admin Settings</h1>
        <p className="text-muted-foreground text-sm font-body mt-2">Manage your super admin profile and application preferences.</p>
      </div>

      <ProfileForm user={{
        id: session.user.id!,
        name: session.user.name ?? null,
        email: session.user.email ?? null
      }} />
    </div>
  );
}
