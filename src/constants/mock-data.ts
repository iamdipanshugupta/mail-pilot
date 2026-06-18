import { Email, LabelItem, NavItem } from "@/types/email";

export const PRIMARY_NAV: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Inbox", href: "/inbox", icon: "Inbox" },
  { label: "Starred", href: "/inbox?view=starred", icon: "Star" },
  { label: "Snoozed", href: "/inbox?view=snoozed", icon: "Clock" },
  { label: "Sent", href: "/inbox?view=sent", icon: "Send" },
  { label: "Drafts", href: "/inbox?view=drafts", icon: "FileEdit" },
  { label: "Calendar", href: "/calendar", icon: "CalendarClock" },
  { label: "AI Assistant", href: "/assistant", icon: "Bot" },
  { label: "Connect Apps", href: "/connect", icon: "Zap" },
  { label: "Spam", href: "/inbox?view=spam", icon: "ShieldAlert", count: 3, countColor: "danger" },
  { label: "Trash", href: "/inbox?view=trash", icon: "Trash2" },
];

export const CATEGORY_NAV: NavItem[] = [
  { label: "Work", href: "/inbox?category=work", icon: "Briefcase" },
  { label: "Personal", href: "/inbox?category=personal", icon: "User" },
  { label: "Updates", href: "/inbox?category=updates", icon: "Bell", count: 12 },
  { label: "Forums", href: "/inbox?category=forums", icon: "Users" },
  { label: "Promotions", href: "/inbox?category=promotions", icon: "Megaphone", count: 8, countColor: "warning" },
];

export const LABELS: LabelItem[] = [
  { label: "Clients", color: "#0f9d8a" },
  { label: "Projects", color: "#6366f1" },
  { label: "Invoices", color: "#ef4444" },
  { label: "Later", color: "#f59e0b" },
];

export const MOCK_EMAILS: Email[] = [];
