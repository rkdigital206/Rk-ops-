import { ExpiryTable, type ExpiryRow } from "@/components/ExpiryTable";
import { PageHeader } from "@/components/Glass";
import { getExpiries } from "@/lib/data";
import { formatDate } from "@/lib/dates";

export const dynamic = "force-dynamic";

export default function ExpiriesPage() {
  const rows: ExpiryRow[] = getExpiries().map((e) => ({ ...e, date: formatDate(e.date) }));

  return (
    <>
      <PageHeader
        title="Expiry tracker"
        subtitle="Domain, hosting aur SSL ek list mein, sabse urgent pehle. Reminders 60, 30, 7 aur 1 din pehle jayenge."
      />
      <ExpiryTable rows={rows} />
    </>
  );
}
