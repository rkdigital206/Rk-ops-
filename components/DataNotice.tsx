import { AlertTriangle, FlaskConical } from "lucide-react";
import type { AppData } from "@/lib/data";

export function DataNotice({ data }: { data: AppData }) {
  if (data.error) {
    return (
      <div role="alert" className="mb-6 flex items-start gap-3 rounded-[14px] border border-rose-400/40 bg-rose-500/15 p-4 text-sm text-rose-100">
        <AlertTriangle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
        <p>
          Database se data load nahi hua: <span className="font-mono text-xs">{data.error}</span>. Check karein ke
          <span className="font-mono text-xs"> supabase/schema.sql</span> run ho chuka hai.
        </p>
      </div>
    );
  }
  if (data.source === "demo") {
    return (
      <div className="mb-6 flex items-start gap-3 rounded-[14px] border border-amber-300/40 bg-amber-400/10 p-4 text-sm text-amber-100">
        <FlaskConical size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
        <p>Demo data dikh raha hai. Supabase connect hone par aapka asli data yahan aayega.</p>
      </div>
    );
  }
  return null;
}

export function EmptyState({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="glass p-10 text-center">
      <h2 className="text-xl font-bold text-white">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-300">{hint}</p>
    </div>
  );
}
