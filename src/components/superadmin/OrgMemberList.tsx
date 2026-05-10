"use client";

import { useState, useTransition, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { UserActions } from "./UserActions";

type Member = {
  user: {
    id: string;
    name: string | null;
    email: string;
    role: string;
    createdAt: Date;
  };
};

export function OrgMemberList({ initialMembers }: { initialMembers: Member[] }) {
  const [members, setMembers] = useState<Member[]>(initialMembers);

  useEffect(() => {
    setMembers(initialMembers);
  }, [initialMembers]);

  return (
    <div className="space-y-3">
      {members.map((m) => (
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
                setMembers(prev => prev.filter(member => member.user.id !== m.user.id));
              }}
              onDeleteRevert={() => {
                setMembers([...members]); // revert to closure captured members
              }}
            />
          </div>
        </div>
      ))}
      {members.length === 0 && (
        <div className="text-center p-6 text-sm text-muted-foreground">
          No members found.
        </div>
      )}
    </div>
  );
}
