import { getAllOrganizations } from "@/lib/actions/superadmin.actions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CreateOrgForm } from "@/components/superadmin/CreateOrgForm";

export default async function SuperAdminDashboard() {
  const session = await auth();
  if (session?.user?.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  const organizations = await getAllOrganizations();

  return (
    <div className="p-8 md:p-10 h-full flex flex-col bg-background min-h-screen text-foreground">
      <div className="mb-10">
        <h1 className="text-3xl font-heading font-bold mb-2">Super Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage all organizations across the platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-bold mb-4">Organizations ({organizations.length})</h2>
          
          {organizations.length === 0 ? (
            <div className="p-8 border border-dashed rounded-xl text-center text-muted-foreground">
              No organizations found. Create one to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {organizations.map((org) => (
                <Link key={org.id} href={`/superadmin/organizations/${org.id}`} className="block">
                  <div className="p-5 border border-border bg-card rounded-2xl flex justify-between items-center shadow-sm hover:border-primary/50 hover:shadow-md transition-all group">
                    <div>
                      <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{org.name}</h3>
                      <p className="text-sm text-muted-foreground">Admin: {org.admin.name} ({org.admin.email})</p>
                    </div>
                    <div className="text-right text-sm flex items-center gap-4">
                      <div>
                        <div className="bg-muted px-3 py-1 rounded-full mb-2 inline-block text-xs font-mono">
                          Code: {org.joinCode}
                        </div>
                        <p className="text-muted-foreground">
                          {org._count.members} Members | {org._count.projects} Projects
                        </p>
                      </div>
                      <svg className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="p-6 border border-border bg-card rounded-2xl sticky top-8 shadow-sm">
            <h2 className="text-xl font-bold mb-6">Create Organization</h2>
            <CreateOrgForm />
          </div>
        </div>
      </div>
    </div>
  );
}
