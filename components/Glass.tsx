import type { ReactNode } from "react";
import { daysLabel, urgency, type Urgency } from "@/lib/dates";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-3xl font-extrabold text-white sm:text-4xl">{title}</h1>
        {subtitle ? <p className="mt-2 max-w-2xl text-base text-slate-300">{subtitle}</p> : null}
      </div>
      {action}
    </header>
  );
}

export function GlassCard({
  children,
  className = "",
  strong = false,
  hover = false,
}: {
  children: ReactNode;
  className?: string;
  strong?: boolean;
  hover?: boolean;
}) {
  return (
    <div className={`${strong ? "glass-strong" : "glass"} ${hover ? "glass-hover" : ""} p-6 ${className}`}>
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "default",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: ReactNode;
  tone?: "default" | "warn" | "bad" | "good";
}) {
  const toneRing = {
    default: "text-cyan",
    warn: "text-amber-300",
    bad: "text-rose-300",
    good: "text-emerald-300",
  }[tone];
  return (
    <GlassCard hover className="fade-up">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-slate-300">{label}</p>
        <span className={`rounded-xl bg-white/10 p-2 ${toneRing}`} aria-hidden="true">
          {icon}
        </span>
      </div>
      <p className="mt-4 font-heading text-4xl font-extrabold text-white">{value}</p>
      {hint ? <p className="mt-1 text-sm text-slate-400">{hint}</p> : null}
    </GlassCard>
  );
}

const urgencyStyle: Record<Urgency, string> = {
  expired: "border-rose-400/40 bg-rose-500/20 text-rose-200",
  critical: "border-rose-400/40 bg-rose-500/20 text-rose-200",
  warning: "border-amber-300/40 bg-amber-400/15 text-amber-200",
  soon: "border-cyan/40 bg-cyan/10 text-cyan",
  ok: "border-emerald-300/30 bg-emerald-400/10 text-emerald-200",
};

export function ExpiryBadge({ days }: { days: number }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold ${urgencyStyle[urgency(days)]}`}
    >
      {daysLabel(days)}
    </span>
  );
}

export function Pill({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "blue" | "good" | "warn" | "bad";
}) {
  const styles = {
    neutral: "border-white/15 bg-white/5 text-slate-200",
    blue: "border-royal/50 bg-royal/20 text-blue-200",
    good: "border-emerald-300/30 bg-emerald-400/10 text-emerald-200",
    warn: "border-amber-300/40 bg-amber-400/15 text-amber-200",
    bad: "border-rose-400/40 bg-rose-500/20 text-rose-200",
  }[tone];
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold ${styles}`}>
      {children}
    </span>
  );
}

export function StatusDot({ status }: { status: "up" | "degraded" | "down" }) {
  const map = {
    up: { c: "bg-emerald-400", t: "Online" },
    degraded: { c: "bg-amber-300", t: "Slow" },
    down: { c: "bg-rose-400", t: "Down" },
  }[status];
  return (
    <span className="inline-flex items-center gap-2 text-sm text-slate-200">
      <span className={`h-2.5 w-2.5 rounded-full ${map.c}`} aria-hidden="true" />
      {map.t}
    </span>
  );
}
