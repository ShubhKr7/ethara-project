import { getOrganizationDetails } from "@/lib/actions/superadmin.actions";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ManageMembersWrapper } from "@/components/superadmin/ManageMembersWrapper";

export default async function OrganizationDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const org = await getOrganizationDetails(id);

  return (
    <div className="p-8 md:p-10 h-full flex flex-col bg-background min-h-screen text-foreground">
      <div className="mb-6">
        <Link href="/superadmin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Organizations
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold mb-2">{org.name}</h1>
            <p className="text-muted-foreground">Detailed view of organization structure and members.</p>
          </div>
          <div className="bg-card border border-border px-4 py-2 rounded-xl text-center shadow-sm">
            <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Join Code</p>
            <p className="font-mono text-lg font-bold">{org.joinCode}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="p-6 border border-border bg-card rounded-2xl shadow-sm">
            <h2 className="text-sm uppercase tracking-widest text-muted-foreground font-bold mb-4">Admin Details</h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                {org.admin.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-lg">{org.admin.name}</h3>
                <p className="text-sm text-muted-foreground">{org.admin.email}</p>
              </div>
            </div>
            <div className="text-xs text-muted-foreground border-t border-border pt-4">
              Created {formatDistanceToNow(new Date(org.admin.createdAt))} ago
            </div>
          </div>

          <div className="p-6 border border-border bg-card rounded-2xl shadow-sm">
            <h2 className="text-sm uppercase tracking-widest text-muted-foreground font-bold mb-4">Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background rounded-xl p-4 text-center border border-border">
                <p className="text-3xl font-bold font-heading">{org.members.length}</p>
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Members</p>
              </div>
              <div className="bg-background rounded-xl p-4 text-center border border-border">
                <p className="text-3xl font-bold font-heading">{org.projects.length}</p>
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Projects</p>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-8">
          <ManageMembersWrapper initialMembers={org.members} orgId={org.id} />

          <div className="p-6 border border-border bg-card rounded-2xl shadow-sm">
            <h2 className="text-xl font-bold mb-6">Projects</h2>
            {org.projects.length === 0 ? (
              <p className="text-sm text-muted-foreground">No projects have been created yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {org.projects.map(project => (
                  <Link 
                    key={project.id} 
                    href={`/superadmin/projects/${project.id}`}
                    className="p-4 border border-border rounded-xl bg-background hover:border-primary/50 hover:shadow-md transition-all group"
                  >
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors mb-1">{project.name}</h3>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>{project._count.tasks} Tasks</span>
                      <span className="text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity">View Board →</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
