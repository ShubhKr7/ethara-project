"use client";

import { useState, useOptimistic, startTransition } from "react";
import { assignUserToProject, removeUserFromProject } from "@/lib/actions/project.actions";
import { toast } from "sonner";

export function AssignMemberModal({ 
  projectId, 
  orgMembers, 
  projectMembers 
}: { 
  projectId: string; 
  orgMembers: any[]; 
  projectMembers: any[]; 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);

  const [optimisticProjectMembers, addOptimisticAction] = useOptimistic(
    projectMembers,
    (state: any[], action: { type: "remove" | "add"; member: any }) => {
      if (action.type === "remove") {
        return state.filter(m => m.userId !== action.member.userId);
      }
      if (action.type === "add") {
        return [...state, action.member];
      }
      return state;
    }
  );

  const availableMembers = orgMembers.filter(
    orgMember => !optimisticProjectMembers.some(pm => pm.userId === orgMember.userId)
  );

  async function handleAssign(member: any) {
    setLoading(member.userId);
    startTransition(() => {
      addOptimisticAction({ type: "add", member: { userId: member.userId, user: member.user, role: "MEMBER" } });
    });
    try {
      await assignUserToProject(projectId, member.userId);
      toast.success(`${member.user.name} added to project`);
    } catch (e: any) {
      toast.error(e.message || "Failed to assign member");
    } finally {
      setLoading(null);
    }
  }

  async function handleRemove(member: any) {
    setLoading(member.userId);
    startTransition(() => {
      addOptimisticAction({ type: "remove", member });
    });
    try {
      await removeUserFromProject(projectId, member.userId);
      toast.success(`${member.user.name} removed from project`);
    } catch (e: any) {
      toast.error(e.message || "Failed to remove member");
    } finally {
      setLoading(null);
      setConfirmRemoveId(null);
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-10 h-10 rounded-full bg-card border-2 border-dashed border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-colors cursor-pointer z-0 relative"
        title="Assign Member"
      >
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-card border border-border rounded-[2rem] shadow-2xl p-8 max-h-[85vh] overflow-hidden flex flex-col">
            <h2 className="text-2xl font-heading italic font-bold mb-2">Manage Project Members</h2>
            <p className="text-sm font-body text-muted-foreground mb-6">Assign members from your organization to collaborate on this project.</p>
            
            <div className="flex-1 overflow-y-auto space-y-8 mb-6 custom-scrollbar pr-2">
              <div>
                <h3 className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-3">Current Project Members</h3>
                <div className="space-y-2">
                  {optimisticProjectMembers.map((m) => (
                    <div key={m.userId} className="flex items-center justify-between p-3 bg-muted/20 border border-border rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
                          {m.user.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-sm font-body">{m.user.name} {m.role === "ADMIN" && <span className="ml-2 text-[9px] uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">Admin</span>}</p>
                          <p className="text-xs text-muted-foreground">{m.user.email}</p>
                        </div>
                      </div>
                      {confirmRemoveId === m.userId ? (
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setConfirmRemoveId(null)}
                            disabled={loading === m.userId}
                            className="text-[10px] uppercase font-bold text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={() => handleRemove(m)}
                            disabled={loading === m.userId}
                            className="text-[10px] uppercase font-bold text-red-500 bg-red-500/10 hover:bg-red-500/20 transition-colors px-3 py-1.5 rounded-lg disabled:opacity-50 flex items-center gap-1"
                          >
                            {loading === m.userId && (
                              <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            )}
                            Confirm
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setConfirmRemoveId(m.userId)}
                          disabled={loading === m.userId}
                          className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50"
                          title="Remove member"
                        >
                          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-3">Available Organization Members</h3>
                <div className="space-y-2">
                  {availableMembers.length === 0 ? (
                    <div className="text-center p-4 text-xs font-bold text-muted-foreground bg-muted/50 rounded-xl border border-dashed border-border">
                      All organization members are already in this project.
                    </div>
                  ) : (
                    availableMembers.map((m) => (
                      <div key={m.userId} className="flex items-center justify-between p-3 border border-border rounded-xl">
                        <div>
                          <p className="font-bold text-sm font-body">{m.user.name}</p>
                          <p className="text-xs text-muted-foreground">{m.user.email}</p>
                        </div>
                        <button 
                          onClick={() => handleAssign(m)}
                          disabled={loading === m.userId}
                          className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold font-body rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center justify-center min-w-[80px]"
                        >
                          {loading === m.userId ? (
                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          ) : (
                            "Add"
                          )}
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setIsOpen(false)}
              disabled={loading !== null}
              className="w-full py-3.5 bg-muted text-muted-foreground font-bold font-body rounded-xl hover:bg-muted/80 transition-colors disabled:opacity-50"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}
