import { GlassCard, PageHeader, Pill } from "@/components/Glass";
import { clientById, requests, siteById, type Request } from "@/lib/data";

export const dynamic = "force-dynamic";

const columns: Request["status"][] = ["New", "In progress", "Awaiting approval", "Follow-up due", "Done"];

function ago(iso: string) {
  const mins = Math.max(1, Math.round((Date.now() - Date.parse(iso)) / 60000));
  if (mins < 60) return `${mins}m ago`;
  if (mins < 1440) return `${Math.round(mins / 60)}h ago`;
  return `${Math.round(mins / 1440)}d ago`;
}

export default function RequestsPage() {
  return (
    <>
      <PageHeader
        title="Requests"
        subtitle="Client WhatsApp message aata hai, AI classify karke yahan task bana deta hai. Aap approve karte hain, kaam hota hai, phir follow-up."
      />

      <div className="-mx-4 overflow-x-auto px-4 pb-2 lg:mx-0 lg:px-0">
        <div className="grid min-w-[1100px] grid-cols-5 gap-4">
          {columns.map((col) => {
            const items = requests.filter((r) => r.status === col);
            return (
              <section key={col} aria-label={col}>
                <h2 className="mb-3 flex items-center justify-between px-1 text-sm font-bold text-white">
                  {col}
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-slate-300">{items.length}</span>
                </h2>
                <div className="space-y-3">
                  {items.map((r) => (
                    <GlassCard key={r.id} hover className="p-4">
                      <div className="flex flex-wrap gap-2">
                        <Pill tone="blue">{clientById(r.clientId).name}</Pill>
                        {r.priority === "Urgent" ? <Pill tone="bad">Urgent</Pill> : null}
                      </div>
                      <p className="mt-3 text-sm text-slate-100">{r.message}</p>
                      <p className="mt-3 text-xs text-slate-400">
                        {siteById(r.siteId).domain} · {r.category} · {ago(r.receivedAt)}
                      </p>
                    </GlassCard>
                  ))}
                  {items.length === 0 ? (
                    <div className="rounded-glass border border-dashed border-white/15 p-6 text-center text-xs text-slate-400">
                      Khali
                    </div>
                  ) : null}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}
