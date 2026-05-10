"use client";

import { useActionState } from "react";
import { createOrganization } from "@/lib/actions/superadmin.actions";

export function CreateOrgForm() {
  const [state, action, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    try {
      await createOrganization(formData);
      return { success: true, message: "Organization created successfully!" };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }, { success: false, message: "" });

  return (
    <form action={action} className="space-y-4">
      {state.message && (
        <div className={`p-3 rounded-xl text-sm font-bold ${state.success ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
          {state.message}
        </div>
      )}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Organization Name</label>
        <input 
          name="name" 
          required 
          className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" 
          placeholder="Acme Corp"
        />
      </div>
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Admin Name</label>
        <input 
          name="adminName" 
          required 
          className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" 
          placeholder="John Doe"
        />
      </div>
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Admin Email</label>
        <input 
          name="adminEmail" 
          type="email"
          required 
          className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" 
          placeholder="admin@acme.com"
        />
      </div>
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Admin Password</label>
        <input 
          name="adminPassword" 
          type="password"
          required 
          className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" 
          placeholder="••••••••"
        />
        <p className="text-[10px] text-muted-foreground mt-1">This will be their login password.</p>
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
        ) : "Create Organization"}
      </button>
    </form>
  );
}
