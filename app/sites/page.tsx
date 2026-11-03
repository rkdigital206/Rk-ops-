import { PageHeader } from "@/components/Glass";
import { SitesExplorer, type SiteRow } from "@/components/SitesExplorer";
import { clientById, clients, hostingById, sites } from "@/lib/data";
import { daysUntil, formatDate } from "@/lib/dates";

export const dynamic = "force-dynamic";

export default function SitesPage() {
  const rows: SiteRow[] = sites.map((s) => {
    const h = hostingById(s.hostingId);
    return {
      id: s.id,
      name: s.name,
      domain: s.domain,
      client: clientById(s.clientId).name,
      platform: s.platform,
      tier: s.tier,
      hosting: `${h.provider} · ${h.panel}`,
      hostingOwner: h.ownedBy === "RK Digital" ? "Hosted by RK Digital" : "Client's own account",
      status: s.status,
      uptime: s.uptime,
      responseMs: s.responseMs,
      domainDays: daysUntil(s.domainExpiry),
      domainDate: formatDate(s.domainExpiry),
    };
  });

  return (
    <>
      <PageHeader
        title="Sites"
        subtitle="Har website ka platform, integration tier, hosting aur health. Tier A = full automation, C = Git deploy, D = sirf monitoring."
      />
      <SitesExplorer rows={rows} clients={clients.map((c) => c.name)} />
    </>
  );
}
