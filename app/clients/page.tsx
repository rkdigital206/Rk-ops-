import { Plus, Phone } from "lucide-react";
import { GlassCard, PageHeader, Pill } from "@/components/Glass";
import { clients, getExpiries, requests, sites } from "@/lib/data";
import { formatDate } from "@/lib/dates";

export const dynamic = "force-dynamic";

export default function ClientsPage() {
  const expiries = getExpiries();

  return (
    <>
      <PageHeader
        title="Clients"
        subtitle="Har client ke saare sites, hosting aur pending kaam ek card mein."
        action={
          <button type="button" className="btn-primary" disabled aria-disabled="true" title="Add client — coming with Supabase">
            <Plus size={16} aria-hidden="true" /> Add client
          </button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {clients.map((c) => {
          const cs = sites.filter((s) => s.clientId === c.id);
          const next = expiries.find((e) => e.client.includes(c.name));
          const open = requests.filter((r) => r.clientId === c.id && r.status !== "Done").length;
          return (
            <GlassCard key={c.id} strong hover>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-white">{c.name}</h2>
                  <p className="mt-1 flex items-center gap-2 text-sm text-slate-300">
                    <Phone size={14} aria-hidden="true" /> {c.whatsapp}
                  </p>
                </div>
                <Pill tone="blue">{c.plan}</Pill>
              </div>

              <dl className="mt-6 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-[14px] border border-white/10 bg-white/5 p-3">
                  <dt className="text-xs text-slate-400">Sites</dt>
                  <dd className="mt-1 font-heading text-2xl font-extrabold text-white">{cs.length}</dd>
                </div>
                <div className="rounded-[14px] border border-white/10 bg-white/5 p-3">
                  <dt className="text-xs text-slate-400">Open requests</dt>
                  <dd className="mt-1 font-heading text-2xl font-extrabold text-white">{open}</dd>
                </div>
                <div className="rounded-[14px] border border-white/10 bg-white/5 p-3">
                  <dt className="text-xs text-slate-400">Monthly</dt>
                  <dd className="mt-1 font-heading text-2xl font-extrabold text-white">${c.monthly}</dd>
                </div>
              </dl>

              <ul className="mt-6 space-y-2">
                {cs.map((s) => (
                  <li key={s.id} className="flex items-center justify-between gap-3 text-sm">
                    <span className="truncate text-slate-100">{s.domain}</span>
                    <Pill>{s.platform}</Pill>
                  </li>
                ))}
              </ul>

              {next ? (
                <p className="mt-5 border-t border-white/10 pt-4 text-xs text-slate-400">
                  Next expiry: <span className="text-slate-200">{next.label}</span> ({next.kind}) on {formatDate(next.date)}
                </p>
              ) : null}
            </GlassCard>
          );
        })}
      </div>
    </>
  );
}
