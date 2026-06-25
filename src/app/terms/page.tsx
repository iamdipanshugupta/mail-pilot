import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | MailPilot",
  description:
    "Terms of Service governing the use of MailPilot.",
};

const sections = [
  {
    title: "Acceptance of Terms",
    content:
      "By accessing or using MailPilot, you agree to be bound by these Terms of Service.",
  },
  {
    title: "Description of Service",
    content:
      "MailPilot is a productivity platform that integrates with Gmail and Google Calendar to help users manage communications, schedules, and workflows.",
  },
  {
    title: "User Accounts",
    content:
      "Users are responsible for maintaining the security of their accounts and credentials.",
  },
  {
    title: "Gmail and Calendar Integrations",
    content:
      "MailPilot accesses Gmail and Google Calendar only with explicit user consent. Users may revoke access at any time through Google Account permissions. MailPilot acts solely on behalf of the authenticated user.",
  },
  {
    title: "User Responsibilities",
    content:
      "Users remain responsible for all emails sent through their connected accounts and all activities performed through their account.",
  },
  {
    title: "Acceptable Use",
    content:
      "Users must use MailPilot only for lawful purposes and in accordance with these Terms.",
  },
  {
    title: "Prohibited Activities",
    content:
      "Spam, abuse, illegal activities, unauthorized access attempts, reverse engineering, and circumvention of security measures are prohibited.",
  },
  {
    title: "Intellectual Property",
    content:
      "All rights, titles, and interests in MailPilot, excluding user content, remain the property of MailPilot and its licensors.",
  },
  {
    title: "Service Availability",
    content:
      "We strive to provide reliable service but do not guarantee uninterrupted availability.",
  },
  {
    title: "Limitation of Liability",
    content:
      "To the fullest extent permitted by law, MailPilot shall not be liable for indirect, incidental, special, consequential, or punitive damages.",
  },
  {
    title: "Termination",
    content:
      "We may suspend or terminate access if users violate these Terms or engage in prohibited activities.",
  },
  {
    title: "Governing Law",
    content:
      "These Terms shall be governed by applicable laws without regard to conflict of law principles.",
  },
];

export default function TermsPage() {
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
            Terms of Service
          </h1>

          <p className="mt-4 text-lg text-muted-foreground">
            These Terms govern your access to and use of MailPilot.
          </p>

          <div className="mt-6 inline-flex rounded-full border px-4 py-2 text-sm">
            Last Updated: June 2026
          </div>
        </div>

        <div className="mt-10 space-y-6">
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
            <h2 className="text-2xl font-semibold">
              Contact Information
            </h2>

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