"use client";

import { useActionState, useRef } from "react";
import { createOrgMemberBySuperAdmin } from "@/lib/actions/superadmin.actions";
import { toast } from "sonner";

export function CreateSuperadminMemberForm({ 
  orgId, 
  onOptimisticAdd 
}: { 
  orgId: string;
  onOptimisticAdd?: (data: { name: string; email: string }) => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  
  const [state, action, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    try {
      if (onOptimisticAdd) {
        onOptimisticAdd({
          name: formData.get("name") as string,
          email: formData.get("email") as string,
        });
      }
      
      await createOrgMemberBySuperAdmin(formData, orgId);
      toast.success("Member created successfully!");
      formRef.current?.reset();
      return { success: true, message: "" };
    } catch (error: any) {
      toast.error(error.message || "An error occurred.");
      return { success: false, message: error.message || "An error occurred." };
    }
  }, { success: false, message: "" });

  return (
    <form ref={formRef} action={action} className="space-y-4">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Full Name</label>
        <input 
          name="name" 
          required 
          className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" 
          placeholder="Jane Doe"
        />
      </div>
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Email</label>
        <input 
          name="email" 
          type="email"
          required 
          className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" 
          placeholder="jane@example.com"
        />
      </div>
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Temporary Password</label>
        <input 
          name="password" 
          type="password"
          required 
          className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" 
          placeholder="••••••••"
        />
        <p className="text-[10px] text-muted-foreground mt-1">Provide this password to the employee.</p>
      </div>
      
      <button 
        type="submit" 
        disabled={isPending}
        className="w-full py-2.5 bg-primary text-primary-foreground font-bold rounded-xl mt-2 hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isPending ? (
          <>
            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating...
          </>
        ) : "Create Member"}
      </button>
    </form>
  );
}
