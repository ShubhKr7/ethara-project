"use client";

import { useOptimistic, startTransition, useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { UserActions } from "./UserActions";
import { CreateSuperadminMemberForm } from "./CreateSuperadminMemberForm";
import { UserRole } from "@prisma/client";

type Member = {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    role: UserRole;
    createdAt: Date;
  };
};

export function ManageMembersWrapper({ initialMembers, orgId }: { initialMembers: Member[]; orgId: string }) {
  // Sync with server on revalidate
  const [syncedMembers, setSyncedMembers] = useState(initialMembers);
  useEffect(() => {
    setSyncedMembers(initialMembers);
  }, [initialMembers]);

  const [optimisticMembers, dispatchOptimistic] = useOptimistic(
    syncedMembers,
    (state, action: { type: "add" | "remove"; member?: Member; id?: string }) => {
      if (action.type === "add" && action.member) {
        return [...state, action.member];
      }
      if (action.type === "remove" && action.id) {
        return state.filter(m => m.user.id !== action.id);
      }
      return state;
    }
  );

  return (
    <div className="space-y-8">
      <div className="p-6 border border-border bg-card rounded-2xl shadow-sm">
        <h2 className="text-xl font-bold mb-6">Organization Members</h2>
        <div className="space-y-3">
          {optimisticMembers.map((m) => (
            <div key={m.user.id} className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-500 flex items-center justify-center text-white font-bold text-sm">
                  {m.user.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold">{m.user.name}</h3>
                  <p className="text-xs text-muted-foreground">{m.user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${m.user.role === 'ADMIN' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    {m.user.role}
                  </span>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Joined {formatDistanceToNow(new Date(m.user.createdAt))} ago
                  </p>
                </div>
                <UserActions 
                  userId={m.user.id} 
                  userName={m.user.name ?? "User"} 
                  isAdmin={m.user.role === "ADMIN"}
                  onOptimisticDelete={() => {
                    startTransition(() => {
                      dispatchOptimistic({ type: "remove", id: m.user.id });
                    });
                  }}
                  onDeleteRevert={() => {
                    // Handled automatically by useOptimistic dropping its local state
                    // However, we need to manually trigger a re-render or let Next.js handle it
                    // Actually, useOptimistic reverts when the server action fails and throws!
                  }}
                />
              </div>
            </div>
          ))}
          {optimisticMembers.length === 0 && (
            <div className="text-center p-6 text-sm text-muted-foreground">
              No members found.
            </div>
          )}
        </div>
      </div>

      <div className="p-6 border border-border bg-card rounded-2xl shadow-sm">
        <h2 className="text-xl font-bold mb-6">Add Member</h2>
        <CreateSuperadminMemberForm 
          orgId={orgId} 
          onOptimisticAdd={(memberData) => {
            startTransition(() => {
              dispatchOptimistic({ 
                type: "add", 
                member: { 
                  user: { 
                    id: `temp-${Date.now()}`, 
                    name: memberData.name, 
                    email: memberData.email, 
                    role: "MEMBER" as UserRole, 
                    createdAt: new Date() 
                  } 
                } 
              });
            });
          }} 
        />
      </div>
    </div>
  );
}
