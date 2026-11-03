"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/actions";
import {
  LogOut,
  LayoutDashboard,
  Users,
  Globe,
  CalendarClock,
  MessageCircle,
  BellRing,
} from "lucide-react";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/sites", label: "Sites", icon: Globe },
  { href: "/expiries", label: "Expiries", icon: CalendarClock },
  { href: "/requests", label: "Requests", icon: MessageCircle },
  { href: "/reminders", label: "Reminders", icon: BellRing },
];

function isActive(path: string, href: string) {
  return href === "/" ? path === "/" : path.startsWith(href);
}

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <span
        className="grid h-10 w-10 place-items-center rounded-xl border border-white/20 bg-gradient-to-br from-royal to-cyan font-heading text-sm font-extrabold text-white"
        aria-hidden="true"
      >
        RK
      </span>
      <div className="leading-tight">
        <p className="font-heading text-base font-extrabold text-white">RK Ops</p>
        <p className="text-xs text-slate-400">Client operations</p>
      </div>
    </div>
  );
}

export function Sidebar({ authEnabled = false }: { authEnabled?: boolean }) {
  const path = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="glass fixed inset-y-4 left-4 z-30 hidden w-64 flex-col p-5 lg:flex">
        <Brand />
        <nav aria-label="Main" className="mt-8 flex flex-1 flex-col gap-1">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = isActive(path, href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-[44px] items-center gap-3 rounded-[14px] px-4 text-sm font-medium transition duration-200 ${
                  active
                    ? "border border-white/15 bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]"
                    : "border border-transparent text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={18} aria-hidden="true" className={active ? "text-cyan" : ""} />
                {label}
              </Link>
            );
          })}
        </nav>
        {authEnabled ? (
          <form action={signOut}>
            <button type="submit" className="btn-ghost w-full">
              <LogOut size={16} aria-hidden="true" /> Sign out
            </button>
          </form>
        ) : (
          <div className="rounded-[14px] border border-white/10 bg-white/5 p-4 text-xs text-slate-300">
            <p className="font-semibold text-white">Demo mode</p>
            <p className="mt-1">Supabase connect nahi hai. Login aur real data abhi off hain.</p>
          </div>
        )}
      </aside>

      {/* Mobile top bar */}
      <div className="glass fixed inset-x-3 top-3 z-30 flex items-center justify-between rounded-[18px] px-4 py-3 lg:hidden">
        <Brand />
        {authEnabled ? (
          <form action={signOut}>
            <button type="submit" aria-label="Sign out" className="grid h-11 w-11 place-items-center rounded-xl border border-white/15 bg-white/5 text-slate-200">
              <LogOut size={18} aria-hidden="true" />
            </button>
          </form>
        ) : null}
      </div>

      {/* Mobile bottom nav */}
      <nav
        aria-label="Main"
        className="glass-strong fixed inset-x-3 bottom-3 z-30 grid grid-cols-6 rounded-[20px] p-1.5 lg:hidden"
      >
        {nav.map(({ href, label, icon: Icon }) => {
          const active = isActive(path, href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-[48px] flex-col items-center justify-center gap-0.5 rounded-2xl text-[10px] font-medium ${
                active ? "bg-white/15 text-white" : "text-slate-300"
              }`}
            >
              <Icon size={18} aria-hidden="true" className={active ? "text-cyan" : ""} />
              {label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
