import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | MailPilot",
  description:
    "Privacy Policy for MailPilot. Learn how we collect, use, protect, and manage your information.",
};

const sections = [
  {
    title: "Information We Collect",
    content:
      "MailPilot may collect account information, email addresses, profile details, authentication information, usage analytics, and technical data necessary to provide and improve the Service.",
  },
  {
    title: "Gmail Data Usage",
    content:
      "MailPilot accesses Gmail data only after explicit user authorization through Google's OAuth process. We only access information required to provide requested features. Gmail data is never sold, shared for advertising purposes, or used for unrelated activities. MailPilot complies with Google's API Services User Data Policy.",
  },
  {
    title: "Google Calendar Data Usage",
    content:
      "MailPilot accesses Google Calendar information only with user consent. Calendar data is used exclusively to provide scheduling, synchronization, reminders, and productivity features requested by the user.",
  },
  {
    title: "How We Use Information",
    content:
      "We use information to provide email management, calendar synchronization, AI-powered productivity tools, account security, customer support, and service improvements.",
  },
  {
    title: "Data Security",
    content:
      "We implement industry-standard security measures including encrypted communications, secure authentication, access controls, and monitoring to protect user information.",
  },
  {
    title: "Data Retention",
    content:
      "Information is retained only as long as necessary to provide the Service, comply with legal obligations, resolve disputes, and enforce agreements.",
  },
  {
    title: "Third-Party Services",
    content:
      "MailPilot relies on trusted providers including Google APIs, authentication providers, hosting services, cloud infrastructure providers, and database services.",
  },
  {
    title: "User Rights",
    content:
      "Users may access, update, correct, export, or request deletion of their personal information. Users may revoke Google permissions at any time through Google Account settings.",
  },
  {
    title: "Account Deletion",
    content:
      "Users may request account deletion. Upon deletion, associated data will be removed according to applicable legal and operational requirements. Connected Google permissions can be revoked directly through Google Account settings.",
  },
  {
    title: "Changes To This Policy",
    content:
      "We may update this Privacy Policy from time to time. Material changes will be communicated through the Service or other appropriate means.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to Home
        </Link>

        <div className="mt-8 rounded-3xl border bg-card p-10 shadow-sm">
          <h1 className="text-4xl font-bold tracking-tight">
            Privacy Policy
          </h1>

          <p className="mt-4 text-lg text-muted-foreground">
            This Privacy Policy explains how MailPilot collects, uses,
            protects, and manages your information when you use our services.
          </p>

          <div className="mt-6 inline-flex rounded-full border px-4 py-2 text-sm">
            Last Updated: June 2026
          </div>
        </div>

        <div className="mt-10 space-y-6">
          <section className="rounded-2xl border bg-card p-8">
            <h2 className="text-2xl font-semibold">Introduction</h2>
            <p className="mt-4 text-muted-foreground leading-7">
              MailPilot is an email and calendar productivity platform designed
              to help users manage communication, schedules, and workflows more
              efficiently. By using MailPilot, you agree to the practices
              described in this Privacy Policy.
            </p>
          </section>

          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-2xl border bg-card p-8"
            >
              <h2 className="text-2xl font-semibold">{section.title}</h2>
              <p className="mt-4 leading-7 text-muted-foreground">
                {section.content}
              </p>
            </section>
          ))}

          <section className="rounded-2xl border bg-card p-8">
            <h2 className="text-2xl font-semibold">Contact Information</h2>

            <p className="mt-4 text-muted-foreground leading-7">
              For questions regarding this Privacy Policy, please contact:
            </p>

            <div className="mt-4 rounded-xl border p-4">
              <p className="font-medium">MailPilot Support</p>
              <p className="text-muted-foreground">
                support@mailpilot.app
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}