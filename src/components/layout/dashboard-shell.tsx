"use client";

import { useState, useEffect } from "react";  
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { signOut } from "next-auth/react";
import {
  Bell,
  Bot,
  Briefcase,
  CalendarClock,
  ChevronDown,
  ChevronUp,
  Clock,
  FileEdit,
  Folder,
  Inbox,
  LayoutDashboard,
  LogOut,
  Mail,
  Megaphone,
  MessageCircle,
  MessageSquareWarning,
  Menu,
  Moon,
  PenSquare,
  Plus,
  Search,
  Send,
  Settings,
  ShieldAlert,
  Star,
  Sun,
  Trash2,
  User,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORY_NAV, LABELS, PRIMARY_NAV } from "@/constants/mock-data";
import { NavItem } from "@/types/email";

const ICONS: Record<string, React.ElementType> = {
  LayoutDashboard,
  Inbox,
  Star,
  Clock,
  Send,
  FileEdit,
  MessageSquareWarning,
  MessageCircle,
  Mail,
  ShieldAlert,
  Trash2,
  Briefcase,
  User,
  Bell,
  Users,
  Megaphone,
  CalendarClock,
  Bot,
};

type DashboardUser = { name: string; email: string; image?: string | null };

function CountBadge({
  count,
  color,
}: {
  count: number;
  color?: NavItem["countColor"];
}) {
  return (
    <span
      className={cn(
        "ml-auto min-w-[20px] rounded-full px-1.5 py-0.5 text-center text-[11px] font-medium leading-none",
        color === "danger" && "bg-accent-red/15 text-accent-red",
        color === "warning" && "bg-accent-amber/15 text-accent-amber",
        (!color || color === "default") && "bg-muted text-muted-foreground",
      )}
    >
      {count}
    </span>
  );
}

function NavRow({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = ICONS[item.icon] ?? Folder;
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
        active
          ? "bg-primary/10 font-semibold text-primary-hover"
          : "text-muted-foreground hover:bg-card-hover hover:text-foreground",
      )}
    >
      <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
      <span className="truncate">{item.label}</span>
      {typeof item.count === "number" && item.count > 0 && (
        <CountBadge count={item.count} color={item.countColor} />
      )}
    </Link>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false); 

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  if (!mounted) {                                    // ← add karo
    return (
      <button type="button" aria-label="Toggle theme"
        className="rounded-full p-2 text-muted-foreground hover:bg-card-hover hover:text-foreground">
        <div className="h-[18px] w-[18px]" />
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className="rounded-full p-2 text-muted-foreground hover:bg-card-hover hover:text-foreground"
    >
      {theme === "dark" ? (
        <Sun className="h-[18px] w-[18px]" />
      ) : (
        <Moon className="h-[18px] w-[18px]" />
      )}
    </button>
  );
}

function UserMenu({ user }: { user: DashboardUser }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5 text-left hover:bg-card-hover"
      >
        {user.image ? (
          <img
            src={user.image}
            alt={user.name}
            className="h-9 w-9 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary-hover">
            {user.name?.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </div>
        <ChevronUp
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
            !open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <div className="absolute bottom-[calc(100%+8px)] left-0 right-0 z-10 overflow-hidden rounded-xl border border-border bg-card shadow-xl">
          <Link
            href="/settings"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 text-sm text-foreground/90 hover:bg-card-hover"
          >
            <Settings className="h-4 w-4" /> Settings
          </Link>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-accent-red hover:bg-card-hover"
          >
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </div>
      )}
    </div>
  );
}

export function DashboardShell({
  user,
  children,
}: {
  user: DashboardUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isActive = (href: string) => {
    const [hrefPath, hrefQuery] = href.split("?");
    if (pathname !== hrefPath) return false;
    if (!hrefQuery)
      return !searchParams.get("view") && !searchParams.get("category");
    const params = new URLSearchParams(hrefQuery);
    for (const [key, value] of params.entries()) {
      if (searchParams.get(key) !== value) return false;
    }
    return true;
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      {sidebarOpen && (
        <aside className="flex h-full w-64 shrink-0 flex-col border-r border-border bg-sidebar p-4">
          <div className="mb-5 flex items-center justify-between px-1">
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Mail className="h-4 w-4" strokeWidth={2.5} />
              </span>
              <span className="text-base font-semibold tracking-tight">
                MailPilot
              </span>
            </Link>
            <button
              type="button"
              aria-label="Collapse sidebar"
              onClick={() => setSidebarOpen(false)}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-card-hover hover:text-foreground"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            className="mb-5 flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90"
          >
            <PenSquare className="h-4 w-4" /> Compose
            <span className="ml-auto rounded-md border border-white/25 px-1.5 py-0.5 text-[10px] opacity-80">
              C
            </span>
          </button>

          <div className="flex-1 space-y-5 overflow-y-auto pr-1">
            <nav className="space-y-1">
              {PRIMARY_NAV.map((item) => (
                <NavRow
                  key={item.label}
                  item={item}
                  active={isActive(item.href)}
                />
              ))}
            </nav>

            <div>
              <button
                type="button"
                onClick={() => setCategoriesOpen((v) => !v)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground"
              >
                <Folder className="h-3.5 w-3.5" /> Categories
                {categoriesOpen ? (
                  <ChevronUp className="ml-auto h-3.5 w-3.5" />
                ) : (
                  <ChevronDown className="ml-auto h-3.5 w-3.5" />
                )}
              </button>
              {categoriesOpen && (
                <nav className="mt-1 space-y-1 pl-1">
                  {CATEGORY_NAV.map((item) => (
                    <NavRow
                      key={item.label}
                      item={item}
                      active={isActive(item.href)}
                    />
                  ))}
                </nav>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Labels
                <button
                  type="button"
                  aria-label="Add label"
                  className="ml-auto rounded-md p-1 hover:bg-card-hover hover:text-foreground"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <nav className="mt-1 space-y-1">
                {LABELS.map((label) => (
                  <button
                    key={label.label}
                    type="button"
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-card-hover hover:text-foreground"
                  >
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: label.color }}
                    />
                    <span className="truncate">{label.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="mt-4">
            <UserMenu user={user} />
          </div>
        </aside>
      )}

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-3 border-b border-border px-6">
          {!sidebarOpen && (
            <button
              type="button"
              aria-label="Open sidebar"
              onClick={() => setSidebarOpen(true)}
              className="shrink-0 rounded-md p-2 text-muted-foreground hover:bg-card-hover hover:text-foreground"
            >
              <Menu className="h-4 w-4" />
            </button>
          )}
          <div className="relative w-full max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search emails..."
              className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-border bg-card-hover px-1.5 py-0.5 text-[11px] text-muted-foreground">
              /
            </kbd>
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              aria-label="Notifications"
              className="rounded-full p-2 text-muted-foreground hover:bg-card-hover hover:text-foreground"
            >
              <Bell className="h-[18px] w-[18px]" />
            </button>
          </div>
        </header>
        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
