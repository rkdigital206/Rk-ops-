import { DataNotice, EmptyState } from "@/components/DataNotice";
import { PageHeader } from "@/components/Glass";
import { SitesExplorer, type SiteRow } from "@/components/SitesExplorer";
import { lookups } from "@/lib/data";
import { getData } from "@/lib/db";
import { daysUntil, formatDate } from "@/lib/dates";

export const dynamic = "force-dynamic";

export default async function SitesPage() {
  const data = await getData();
  const { clientName, hosting } = lookups(data);

  const rows: SiteRow[] = data.sites.map((s) => {
    const h = hosting(s.hostingId);
    return {
      id: s.id,
      name: s.name,
      domain: s.domain,
      client: clientName(s.clientId),
      platform: s.platform,
      tier: s.tier,
      hosting: h ? `${h.provider} · ${h.panel}` : "Hosting not set",
      hostingOwner: h ? (h.ownedBy === "RK Digital" ? "Hosted by RK Digital" : "Client's own account") : "—",
      status: s.status,
      uptime: s.uptime,
      responseMs: s.responseMs,
      domainDays: s.domainExpiry ? daysUntil(s.domainExpiry) : null,
      domainDate: s.domainExpiry ? formatDate(s.domainExpiry) : "not set",
    };
  });

  return (
    <>
      <PageHeader
        title="Sites"
        subtitle="Har website ka platform, integration tier, hosting aur health. Tier A = full automation, C = Git deploy, D = sirf monitoring."
      />
      <DataNotice data={data} />
      {rows.length === 0 && !data.error ? (
        <EmptyState title="Koi site nahi" hint="Supabase ke sites table mein pehli website add karein." />
      ) : (
        <SitesExplorer rows={rows} clients={data.clients.map((c) => c.name)} />
      )}
    </>
  );
}
