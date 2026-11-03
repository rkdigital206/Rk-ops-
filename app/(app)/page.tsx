import Link from "next/link";
import { AlertTriangle, CalendarClock, Globe, MessageCircle, ArrowRight } from "lucide-react";
import { DataNotice, EmptyState } from "@/components/DataNotice";
import { ExpiryBadge, GlassCard, PageHeader, Pill, StatCard, StatusDot } from "@/components/Glass";
import { getExpiries, lookups } from "@/lib/data";
import { getData } from "@/lib/db";
import { formatDate } from "@/lib/dates";

export const dynamic = "force-dynamic";

function greeting() {
  const hour = Number(
    new Date().toLocaleString("en-GB", { hour: "numeric", hour12: false, timeZone: "Asia/Karachi" }),
  );
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardPage() {
  const data = await getData();
  const { clientName, site } = lookups(data);
  const expiries = getExpiries(data);
  const upcoming = expiries.filter((e) => e.days <= 60).slice(0, 6);
  const critical = expiries.filter((e) => e.days <= 30).length;
  const online = data.sites.filter((s) => s.status === "up").length;
  const openRequests = data.requests.filter((r) => r.status !== "Done");
  const attention = data.sites.filter((s) => s.status !== "up");

  return (
    <>
      <PageHeader
        title={`${greeting()}, Rehan`}
        subtitle="Aapke clients, domains aur hosting ka poora status ek jagah. Pehle jo expire hone wala hai, woh upar."
        action={
          <Link href="/requests" className="btn-primary">
            View requests <ArrowRight size={16} aria-hidden="true" />
          </Link>
        }
      />
      <DataNotice data={data} />

      {data.sites.length === 0 && !data.error ? (
        <EmptyState
          title="Abhi koi data nahi hai"
          hint="Supabase mein pehla client, hosting aur site add karein. Dashboard khud update ho jayega."
        />
      ) : (
        <>
          <section aria-label="Key numbers" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Websites managed"
              value={data.sites.length}
              hint={`${data.clients.length} clients`}
              icon={<Globe size={18} />}
            />
            <StatCard
              label="Online right now"
              value={`${online}/${data.sites.length}`}
              hint={`${attention.length} need attention`}
              tone={attention.length ? "warn" : "good"}
              icon={<AlertTriangle size={18} />}
            />
            <StatCard
              label="Expiring in 30 days"
              value={critical}
              hint="Domains, hosting, SSL"
              tone={critical ? "bad" : "good"}
              icon={<CalendarClock size={18} />}
            />
            <StatCard
              label="Open requests"
              value={openRequests.length}
              hint="From WhatsApp"
              icon={<MessageCircle size={18} />}
            />
          </section>

          <div className="mt-6 grid gap-6 lg:grid-cols-5">
            <GlassCard strong className="lg:col-span-3">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Upcoming expiries</h2>
                <Link href="/expiries" className="text-sm font-medium text-cyan hover:underline">
                  See all
                </Link>
              </div>
              {upcoming.length === 0 ? (
                <p className="text-sm text-slate-300">Agle 60 din mein koi expiry nahi.</p>
              ) : (
                <ul className="divide-y divide-white/10">
                  {upcoming.map((e) => (
                    <li key={e.id} className="flex items-center justify-between gap-4 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">{e.label}</p>
                        <p className="text-xs text-slate-400">
                          {e.kind} · {e.client} · {formatDate(e.date)}
                        </p>
                      </div>
                      <ExpiryBadge days={e.days} />
                    </li>
                  ))}
                </ul>
              )}
            </GlassCard>

            <GlassCard className="lg:col-span-2">
              <h2 className="mb-5 text-xl font-bold text-white">Needs attention</h2>
              {attention.length === 0 ? (
                <p className="text-sm text-slate-300">Sab sites theek chal rahi hain.</p>
              ) : (
                <ul className="space-y-3">
                  {attention.map((s) => (
                    <li key={s.id} className="rounded-[14px] border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate text-sm font-semibold text-white">{s.name}</p>
                        <StatusDot status={s.status} />
                      </div>
                      <p className="mt-1 text-xs text-slate-400">
                        {s.domain} · uptime {s.uptime}%
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </GlassCard>
          </div>

          <GlassCard className="mt-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Latest WhatsApp requests</h2>
              <Link href="/requests" className="text-sm font-medium text-cyan hover:underline">
                Open board
              </Link>
            </div>
            {openRequests.length === 0 ? (
              <p className="text-sm text-slate-300">Koi open request nahi.</p>
            ) : (
              <ul className="grid gap-3 md:grid-cols-2">
                {openRequests.slice(0, 4).map((r) => (
                  <li key={r.id} className="rounded-[14px] border border-white/10 bg-white/5 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Pill tone="blue">{clientName(r.clientId)}</Pill>
                      <Pill tone={r.priority === "Urgent" ? "bad" : "neutral"}>{r.priority}</Pill>
                      <Pill>{r.status}</Pill>
                    </div>
                    <p className="mt-3 text-sm text-slate-100">{r.message}</p>
                    <p className="mt-2 text-xs text-slate-400">{site(r.siteId)?.domain ?? "—"}</p>
                  </li>
                ))}
              </ul>
            )}
          </GlassCard>
        </>
      )}
    </>
  );
}
