import { DataNotice, EmptyState } from "@/components/DataNotice";
import { ExpiryTable, type ExpiryRow } from "@/components/ExpiryTable";
import { PageHeader } from "@/components/Glass";
import { getExpiries } from "@/lib/data";
import { getData } from "@/lib/db";
import { formatDate } from "@/lib/dates";

export const dynamic = "force-dynamic";

export default async function ExpiriesPage() {
  const data = await getData();
  const rows: ExpiryRow[] = getExpiries(data).map((e) => ({ ...e, date: formatDate(e.date) }));

  return (
    <>
      <PageHeader
        title="Expiry tracker"
        subtitle="Domain, hosting aur SSL ek list mein, sabse urgent pehle. Reminders 60, 30, 7 aur 1 din pehle jayenge."
      />
      <DataNotice data={data} />
      {rows.length === 0 && !data.error ? (
        <EmptyState title="Koi expiry date nahi" hint="Sites aur hostings mein expiry dates daalein, yahan khud nazar aayengi." />
      ) : (
        <ExpiryTable rows={rows} />
      )}
    </>
  );
}
