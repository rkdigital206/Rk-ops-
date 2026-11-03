"use client";

import { useState } from "react";
import { BellRing } from "lucide-react";
import { ExpiryBadge, GlassCard, Pill } from "@/components/Glass";

export interface ExpiryRow {
  id: string;
  kind: "Domain" | "Hosting" | "SSL";
  label: string;
  client: string;
  owner: string;
  date: string;
  days: number;
  amount?: number;
}

const filters = ["All", "Domain", "Hosting", "SSL"] as const;
const ranges = [
  { id: "all", label: "Any time", max: Infinity },
  { id: "60", label: "60 days", max: 60 },
  { id: "30", label: "30 days", max: 30 },
  { id: "7", label: "7 days", max: 7 },
];

export function ExpiryTable({ rows }: { rows: ExpiryRow[] }) {
  const [kind, setKind] = useState<(typeof filters)[number]>("All");
  const [range, setRange] = useState("all");
  const [sent, setSent] = useState<Record<string, boolean>>({});

  const max = ranges.find((r) => r.id === range)!.max;
  const visible = rows.filter((r) => (kind === "All" || r.kind === kind) && r.days <= max);

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div role="tablist" aria-label="Filter by type" className="glass flex gap-1 p-1">
          {filters.map((f) => (
            <button
              key={f}
              role="tab"
              type="button"
              aria-selected={kind === f}
              onClick={() => setKind(f)}
              className={`min-h-[40px] flex-1 rounded-xl px-4 text-sm font-medium transition sm:flex-none ${
                kind === f ? "bg-white/15 text-white" : "text-slate-300 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-3 text-sm text-slate-300">
          Show
          <select value={range} onChange={(e) => setRange(e.target.value)} className="input-glass w-auto bg-navy/60">
            {ranges.map((r) => (
              <option key={r.id} value={r.id} className="bg-navy">
                {r.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <GlassCard strong className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <caption className="sr-only">Domain, hosting and SSL expiries sorted by urgency</caption>
            <thead className="border-b border-white/10 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold">Item</th>
                <th scope="col" className="px-4 py-4 font-semibold">Client</th>
                <th scope="col" className="px-4 py-4 font-semibold">Date</th>
                <th scope="col" className="px-4 py-4 font-semibold">Status</th>
                <th scope="col" className="px-6 py-4 text-right font-semibold">Reminder</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {visible.map((r) => (
                <tr key={r.id} className="transition hover:bg-white/[0.04]">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Pill tone={r.kind === "Hosting" ? "blue" : r.kind === "SSL" ? "good" : "neutral"}>{r.kind}</Pill>
                      <span className="font-semibold text-white">{r.label}</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-400">
                      {r.owner}
                      {r.amount ? ` · renewal $${r.amount}` : ""}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-slate-200">{r.client}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-slate-200">{r.date}</td>
                  <td className="px-4 py-4">
                    <ExpiryBadge days={r.days} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSent((s) => ({ ...s, [r.id]: true }))}
                      disabled={sent[r.id]}
                      className="btn-ghost min-h-[40px] px-4 disabled:opacity-60"
                    >
                      <BellRing size={14} aria-hidden="true" />
                      {sent[r.id] ? "Queued" : "Send now"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {visible.length === 0 ? <p className="p-8 text-center text-sm text-slate-300">Is filter mein kuch nahi hai.</p> : null}
      </GlassCard>
      <p className="mt-3 text-xs text-slate-400">&quot;Send now&quot; abhi demo hai. n8n connect hone par yeh WhatsApp template bhejega.</p>
    </>
  );
}
