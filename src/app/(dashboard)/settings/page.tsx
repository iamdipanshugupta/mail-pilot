import { auth } from "@/server/auth/auth";
import { redirect } from "next/navigation";
import { CalendarClock, Mail, Settings, Shield, Palette } from "lucide-react";

export default async function SettingsPage() {
  const session = await auth();
  if (!session) redirect("/login");
  const user = session.user;

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your profile and integrations.</p>

        {/* Profile */}
        <section className="mt-6 rounded-2xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            <Shield className="h-4 w-4" /> Profile
          </div>
          <div className="flex items-center gap-4">
            {user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.image} alt={user.name ?? "User"} className="h-16 w-16 rounded-full object-cover ring-2 ring-primary/20" />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-2xl font-bold text-primary-hover">
                {(user?.name ?? "U").charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-lg font-semibold">{user?.name}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <span className="mt-1 inline-block rounded-full bg-accent-green/15 px-2.5 py-0.5 text-xs font-medium text-accent-green">Google account connected</span>
            </div>
          </div>
        </section>

        {/* Integrations */}
        <section className="mt-4 rounded-2xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            <Settings className="h-4 w-4" /> Integrations
          </div>
          <div className="space-y-3">
            {[
              { icon: Mail, label: "Gmail", sub: "Read, send & manage emails via Corsair", status: "Connected" },
              { icon: CalendarClock, label: "Google Calendar", sub: "View & create events via Corsair", status: "Connected" },
            ].map(({ icon: Icon, label, sub, status }) => (
              <div key={label} className="flex items-center gap-3 rounded-xl border border-border p-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary-hover"><Icon className="h-5 w-5" /></span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs text-muted-foreground">{sub}</p>
                </div>
                <span className="rounded-full bg-accent-green/15 px-2.5 py-1 text-xs font-medium text-accent-green">{status}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Theme */}
        <section className="mt-4 rounded-2xl border border-border bg-card p-6">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            <Palette className="h-4 w-4" /> Appearance
          </div>
          <p className="text-sm text-muted-foreground">Use the Sun/Moon toggle in the top header to switch between light and dark mode. Your preference is saved automatically.</p>
        </section>
      </div>
    </div>
  );
}
