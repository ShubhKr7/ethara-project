import { getMyOrganization } from "@/lib/actions/team.actions";
import { CreateMemberForm } from "@/components/dashboard/CreateMemberForm";

export default async function TeamPage() {
  const org = await getMyOrganization();

  if (!org) {
    return (
      <div className="p-8 h-full flex items-center justify-center">
        <p className="text-muted-foreground">You do not have an organization set up yet.</p>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-10 h-full flex flex-col bg-background">
      <div className="mb-10 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Team Management</h1>
          <p className="text-muted-foreground">Manage employees for {org.name}</p>
        </div>
        <div className="bg-card border border-border px-4 py-2 rounded-xl text-center">
          <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Org Join Code</p>
          <p className="font-mono text-lg font-bold">{org.joinCode}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-bold mb-4">Members ({org.members.length})</h2>
          <div className="space-y-4">
            {org.members.map((m) => (
              <div key={m.id} className="p-5 border border-border bg-card rounded-2xl flex items-center gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-white font-bold">
                  {m.user.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold">{m.user.name}</h3>
                  <p className="text-sm text-muted-foreground">{m.user.email}</p>
                </div>
                <div className="ml-auto">
                  <span className="px-3 py-1 bg-muted rounded-full text-xs font-bold uppercase">
                    {m.user.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="p-6 border border-border bg-card rounded-2xl sticky top-8">
            <h2 className="text-xl font-bold mb-6">Add Member</h2>
            <CreateMemberForm />
          </div>
        </div>
      </div>
    </div>
  );
}
