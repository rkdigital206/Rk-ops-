import { CheckCircle2 } from "lucide-react";
import { GlassCard, PageHeader, Pill } from "@/components/Glass";

const rules = [
  { days: 60, who: "Sirf aap", tone: "neutral" as const, note: "Early heads-up, renewal plan karein" },
  { days: 30, who: "Aap + client", tone: "blue" as const, note: "Client ko renewal amount ke saath message" },
  { days: 7, who: "Aap + client", tone: "warn" as const, note: "Urgent reminder, payment follow-up" },
  { days: 1, who: "Aap + client", tone: "bad" as const, note: "Last call, expiry kal hai" },
];

const templates = [
  {
    name: "expiry_client_30d",
    body: "Hi {{client}}, {{item}} ({{domain}}) {{date}} ko expire ho raha hai. Renewal amount {{amount}}. Kya main renew kar dun?",
  },
  {
    name: "task_done_followup",
    body: "Hi {{client}}, aapka kaam complete ho gaya hai: {{summary}}. Please check karke bata dein ke sab theek hai.",
  },
];

export default function RemindersPage() {
  return (
    <>
      <PageHeader
        title="Reminders"
        subtitle="n8n har roz subah expiry check karta hai aur WhatsApp Cloud API se message bhejta hai."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard strong>
          <h2 className="mb-5 text-xl font-bold text-white">Schedule</h2>
          <ol className="space-y-4">
            {rules.map((r) => (
              <li key={r.days} className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/15 bg-white/10 font-heading text-lg font-extrabold text-white">
                  {r.days}d
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-white">{r.days} din pehle</p>
                    <Pill tone={r.tone}>{r.who}</Pill>
                  </div>
                  <p className="mt-1 text-sm text-slate-300">{r.note}</p>
                </div>
              </li>
            ))}
          </ol>
        </GlassCard>

        <GlassCard>
          <h2 className="mb-5 text-xl font-bold text-white">WhatsApp templates</h2>
          <div className="space-y-4">
            {templates.map((t) => (
              <div key={t.name} className="rounded-[14px] border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-semibold text-cyan">{t.name}</p>
                <p className="mt-2 text-sm text-slate-100">{t.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-400">
            Meta ko templates approve karwane parte hain. 24 ghante ke window ke bahar sirf approved templates jate hain.
          </p>
        </GlassCard>
      </div>

      <GlassCard className="mt-6">
        <h2 className="mb-4 text-xl font-bold text-white">Setup checklist</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {[
            "Supabase project + schema.sql run karein",
            "n8n import: n8n/expiry-reminders.json",
            "WhatsApp Cloud API number + templates approve",
            "Uptime Kuma monitors add karein",
          ].map((t) => (
            <li key={t} className="flex items-center gap-3 text-sm text-slate-200">
              <CheckCircle2 size={18} className="text-slate-500" aria-hidden="true" /> {t}
            </li>
          ))}
        </ul>
      </GlassCard>
    </>
  );
}
