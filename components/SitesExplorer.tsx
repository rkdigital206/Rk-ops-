"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ExpiryBadge, GlassCard, Pill, StatusDot } from "@/components/Glass";

export interface SiteRow {
  id: string;
  name: string;
  domain: string;
  client: string;
  platform: string;
  tier: string;
  hosting: string;
  hostingOwner: string;
  status: "up" | "degraded" | "down";
  uptime: number;
  responseMs: number;
  domainDays: number;
  domainDate: string;
}

const tierHelp: Record<string, string> = {
  A: "Full — WordPress API",
  C: "Code — Git + deploy",
  D: "Monitor only",
};

export function SitesExplorer({ rows, clients }: { rows: SiteRow[]; clients: string[] }) {
  const [q, setQ] = useState("");
  const [client, setClient] = useState("All");

  const filtered = useMemo(
    () =>
      rows.filter(
        (r) =>
          (client === "All" || r.client === client) &&
          (q.trim() === "" || `${r.name} ${r.domain}`.toLowerCase().includes(q.toLowerCase())),
      ),
    [rows, q, client],
  );

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Search sites</span>
          <Search size={16} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by site or domain"
            className="input-glass pl-11"
          />
        </label>
        <div role="tablist" aria-label="Filter by client" className="glass flex gap-1 p-1">
          {["All", ...clients].map((c) => (
            <button
              key={c}
              role="tab"
              type="button"
              aria-selected={client === c}
              onClick={() => setClient(c)}
              className={`min-h-[40px] rounded-xl px-4 text-sm font-medium transition ${
                client === c ? "bg-white/15 text-white" : "text-slate-300 hover:text-white"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((s) => (
          <GlassCard key={s.id} hover className="fade-up">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="truncate text-lg font-bold text-white">{s.name}</h2>
                <p className="truncate text-sm text-cyan">{s.domain}</p>
              </div>
              <StatusDot status={s.status} />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Pill tone="blue">{s.platform}</Pill>
              <Pill>Tier {s.tier}: {tierHelp[s.tier]}</Pill>
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-xs text-slate-400">Hosting</dt>
                <dd className="text-slate-100">{s.hosting}</dd>
                <dd className="text-xs text-slate-400">{s.hostingOwner}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400">Uptime / speed</dt>
                <dd className="text-slate-100">{s.uptime}%</dd>
                <dd className="text-xs text-slate-400">{s.responseMs ? `${s.responseMs} ms` : "No response"}</dd>
              </div>
            </dl>

            <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
              <span className="text-xs text-slate-400">Domain renews {s.domainDate}</span>
              <ExpiryBadge days={s.domainDays} />
            </div>
          </GlassCard>
        ))}
      </div>

      {filtered.length === 0 ? (
        <GlassCard className="mt-4 text-center text-sm text-slate-300">Koi site match nahi hui.</GlassCard>
      ) : null}
    </>
  );
}
