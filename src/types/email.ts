export type Email = {
  id: string;
  sender: string;
  senderEmail: string;
  subject: string;
  preview: string;
  body: EmailBodyBlock[];
  time: string;
  date: string;
  unread: boolean;
  starred: boolean;
  avatarColor: string;
};

export type EmailBodyBlock =
  | { type: "banner"; brand: string; heading: string }
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: { icon: string; text: string }[] }
  | { type: "button"; label: string }
  | { type: "footer"; lines: string[] };

export type NavItem = {
  label: string;
  href: string;
  icon: string;
  count?: number;
  countColor?: "default" | "warning" | "danger";
};

export type LabelItem = {
  label: string;
  color: string;
};
