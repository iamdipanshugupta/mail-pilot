import Link from "next/link";
import {
  Bot,
  CalendarClock,
  Inbox,
  Mail,
  Search,
  Star,
  Zap,
} from "lucide-react";

const FEATURES = [
  {
    icon: Inbox,
    title: "Smart Inbox",
    description:
      "Your Gmail, reorganized. Priority emails surface automatically so the important stuff never gets buried.",
  },
  {
    icon: CalendarClock,
    title: "Calendar Sync",
    description:
      "See and manage your Google Calendar right alongside your inbox. Schedule meetings without switching tabs.",
  },
  {
    icon: Bot,
    title: "AI Assistant",
    description:
      'Just type "send Riya the Q2 deck and book 30 mins tomorrow" — your assistant handles the rest.',
  },
  {
    icon: Zap,
    title: "Realtime Updates",
    description:
      "New mail and events show up instantly via webhooks — no refreshing, no waiting, no polling.",
  },
  {
    icon: Search,
    title: "Lightning Search",
    description:
      "Search across your entire mailbox in milliseconds with a local, cached index of every conversation.",
  },
  {
    icon: Star,
    title: "Built For Speed",
    description:
      "Keyboard shortcuts for everything. Compose, archive, snooze and navigate without touching your mouse.",
  },
];

// The signature element: a live-feeling terminal strip showing what
// Corsair is actually doing under the hood while you type one sentence.
const AGENT_STEPS = [
  { tag: "You", text: "send Riya the Q2 deck and book 30 min tomorrow at 4", tone: "user" },
  { tag: "Corsair · Gmail", text: "Drafting email to riya@company.com with attachment", tone: "agent" },
  { tag: "Corsair · Calendar", text: "Creating event \u201cSync w/ Riya\u201d \u2014 Tomorrow, 4:00\u20134:30 PM", tone: "agent" },
  { tag: "Done", text: "Email sent. Invite created. Riya notified.", tone: "done" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#fbf9f5] text-[#1c1b1a]">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-[#ece6d9] bg-[#fbf9f5]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0f9d8a] text-white">
              <Mail className="h-4 w-4" strokeWidth={2.5} />
            </span>
            <span className="text-lg font-semibold tracking-tight">MailPilot</span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-[#6b6358] md:flex">
            <a href="#features" className="hover:text-[#1c1b1a]">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-[#1c1b1a]">
              How it works
            </a>
            <a href="#" className="hover:text-[#1c1b1a]">
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-lg px-4 py-2 text-sm font-medium text-[#3f3a33] hover:bg-[#f1ece2] sm:inline-block"
            >
              Log in
            </Link>
            <Link
              href="/login"
              className="rounded-lg bg-[#0f9d8a] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#0c8577]"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pb-16 pt-20 text-center sm:pt-28">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#cdeae4] bg-[#e6f6f3] px-4 py-1.5 text-sm font-medium text-[#0c8577]">
          <Zap className="h-3.5 w-3.5" />
          Built on Corsair &middot; Gmail + Google Calendar, unified
        </span>

        <h1 className="mx-auto mt-6 max-w-3xl text-5xl font-bold leading-[1.15] tracking-tight sm:text-6xl">
          Tell it what to do.
          <br />
          Watch your inbox do it.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-[#6b6358]">
          MailPilot wires Gmail and Google Calendar together through Corsair,
          so one sentence can send an email, book a meeting, and notify
          someone — without you ever opening a Google tab.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/login"
            className="rounded-xl bg-[#0f9d8a] px-6 py-3 text-base font-semibold text-white shadow-lg shadow-[#0f9d8a]/20 hover:bg-[#0c8577]"
          >
            Connect your inbox
          </Link>
          <a
            href="#how-it-works"
            className="rounded-xl border border-[#e2dccd] bg-white px-6 py-3 text-base font-semibold text-[#3f3a33] hover:bg-[#f7f3ea]"
          >
            See how it works
          </a>
        </div>
      </section>

      {/* Signature element: live agent strip */}
      <section className="mx-auto max-w-4xl px-6 pb-24">
        <div className="overflow-hidden rounded-2xl border border-[#2a2826] bg-[#161514] shadow-2xl shadow-black/20">
          <div className="flex items-center gap-2 border-b border-[#2a2826] bg-[#1c1b1a] px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            <span className="ml-3 font-mono text-xs text-[#7a766d]">
              mailpilot &middot; agent
            </span>
          </div>
          <div className="space-y-3 p-6 text-left font-mono text-sm">
            {AGENT_STEPS.map((step) => (
              <div key={step.text} className="flex items-start gap-3">
                <span
                  className={
                    step.tone === "user"
                      ? "shrink-0 rounded-md bg-[#2a2826] px-2 py-0.5 text-xs font-semibold text-[#e8e3d8]"
                      : step.tone === "done"
                        ? "shrink-0 rounded-md bg-[#0f9d8a]/20 px-2 py-0.5 text-xs font-semibold text-[#5eead4]"
                        : "shrink-0 rounded-md bg-[#1f3a3a] px-2 py-0.5 text-xs font-semibold text-[#5eead4]"
                  }
                >
                  {step.tag}
                </span>
                <span
                  className={
                    step.tone === "user"
                      ? "text-[#e8e3d8]"
                      : step.tone === "done"
                        ? "text-[#5eead4]"
                        : "text-[#bdb6a9]"
                  }
                >
                  {step.text}
                </span>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-4 text-center text-sm text-[#a39c8e]">
          Real Gmail and Calendar API calls, routed through Corsair &mdash; not a scripted demo.
        </p>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything your inbox should already do
          </h2>
          <p className="mt-4 text-[#6b6358]">
            MailPilot layers smart workflows on top of Gmail and Calendar —
            without locking your data behind another inbox.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-[#ece6d9] bg-white p-6 transition-colors hover:border-[#cdeae4] hover:bg-[#f4faf9]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e6f6f3] text-[#0c8577]">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-[#6b6358]">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-3xl bg-[#1c1b1a] px-8 py-16 text-center text-white sm:px-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#3a3733] bg-[#242220] px-3 py-1 text-xs font-medium text-[#bdb6a9]">
            Powered by Corsair
          </span>
          <h2 className="mt-5 text-3xl font-bold sm:text-4xl">
            Connect your Google account, and you&apos;re live
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[#bdb6a9]">
            MailPilot securely connects to Gmail and Google Calendar through
            Corsair in one click. No imports, no migrations — your data stays
            in Google, encrypted at rest.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-block rounded-xl bg-[#14b8a6] px-6 py-3 text-base font-semibold text-[#06231f] hover:bg-[#2dd4bf]"
          >
            Connect your Google account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#ece6d9]">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            <div className="col-span-2 sm:col-span-1">
              <Link href="/" className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0f9d8a] text-white">
                  <Mail className="h-4 w-4" strokeWidth={2.5} />
                </span>
                <span className="text-lg font-semibold tracking-tight">MailPilot</span>
              </Link>
              <p className="mt-3 text-sm text-[#6b6358]">
                Email &amp; calendar, reimagined with AI. Built on Corsair.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-[#1c1b1a]">Product</h4>
              <ul className="mt-3 space-y-2 text-sm text-[#6b6358]">
                <li><a href="#features" className="hover:text-[#1c1b1a]">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-[#1c1b1a]">How it works</a></li>
                <li><a href="#" className="hover:text-[#1c1b1a]">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-[#1c1b1a]">Company</h4>
              <ul className="mt-3 space-y-2 text-sm text-[#6b6358]">
                <li><a href="#" className="hover:text-[#1c1b1a]">About</a></li>
                <li><a href="#" className="hover:text-[#1c1b1a]">Blog</a></li>
                <li><a href="#" className="hover:text-[#1c1b1a]">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-[#1c1b1a]">Legal</h4>
              <ul className="mt-3 space-y-2 text-sm text-[#6b6358]">
                <li><a href="#" className="hover:text-[#1c1b1a]">Privacy</a></li>
                <li><a href="#" className="hover:text-[#1c1b1a]">Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-[#ece6d9] pt-6 sm:flex-row">
            <p className="text-sm text-[#6b6358]">
              &copy; {new Date().getFullYear()} MailPilot. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-[#a39c8e]">
              <span>Built on Corsair</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}