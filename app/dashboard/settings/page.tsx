import ChangePassword from "@/components/settings/change-password";
import ProfileCard from "@/components/settings/profile-card";
import { SettingCard } from "@/components/settings/settings-card";
import TwoFactorAuthentication from "@/components/settings/two-factor";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

const settingsPage = async () => {
  const session = await auth();
  if (!session?.user) return redirect("/");
  return (
    <SettingCard title="Settings" description="Manage your account settings.">
      <main className="flex flex-1 flex-col lg:flex-row gap-4 mt-5">
        <div className="flex-1">
          <ProfileCard session={session} />
        </div>

        <div className="space-y-4 flex-1">
          {!session.user.isOauth && session.user.email && (
            <>
              <ChangePassword email={session.user.email} />
              <TwoFactorAuthentication
                isTwoFactorEnabled={session.user.isTwoFactorEnabled}
                email={session.user.email}
              />
            </>
          )}
        </div>
      </main>
    </SettingCard>
  );
};

export default settingsPage;
