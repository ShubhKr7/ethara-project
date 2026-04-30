import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/dashboard/ProfileForm";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="p-8 md:p-12 max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="font-heading italic text-white text-4xl md:text-5xl tracking-tight">Account Settings</h1>
        <p className="text-white/40 text-sm font-body mt-2">Manage your profile and application preferences.</p>
      </div>

      <ProfileForm user={{
        id: session.user.id!,
        name: session.user.name,
        email: session.user.email
      }} />
    </div>
  );
}
