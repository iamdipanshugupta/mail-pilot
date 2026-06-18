import { auth } from "@/server/auth/auth";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const user = {
    name: session.user?.name ?? "User",
    email: session.user?.email ?? "",
    image: session.user?.image,
  };

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
