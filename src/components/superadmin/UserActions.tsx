"use client";

import { useTransition } from "react";
import { deleteUser } from "@/lib/actions/superadmin.actions";
import { toast } from "sonner";

export function UserActions({ 
  userId, 
  userName, 
  isAdmin, 
  onOptimisticDelete, 
  onDeleteRevert 
}: { 
  userId: string, 
  userName: string, 
  isAdmin: boolean,
  onOptimisticDelete?: () => void,
  onDeleteRevert?: () => void
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (isAdmin) {
      alert("This user is the Admin of the Organization. Please reassign the Admin role to someone else before deleting them.");
      return;
    }

    if (confirm(`Are you sure you want to completely delete ${userName}? This action cannot be undone.`)) {
      onOptimisticDelete?.();
      
      startTransition(async () => {
        try {
          await deleteUser(userId);
          toast.success("User deleted successfully");
        } catch (error: any) {
          onDeleteRevert?.();
          toast.error(error.message || "Failed to delete user.");
        }
      });
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${isAdmin ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50' : 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white'}`}
      title={isAdmin ? "Cannot delete the current Admin." : "Delete User"}
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
