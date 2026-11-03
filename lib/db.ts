import { createClient } from "./supabase/server";
import {
  demoData,
  type AppData,
  type Client,
  type Hosting,
  type Platform,
  type Request,
  type Site,
  type Tier,
} from "./data";

type Row = Record<string, unknown>;

const str = (v: unknown, fallback = "") => (typeof v === "string" ? v : fallback);
const num = (v: unknown, fallback = 0) => (v === null || v === undefined || v === "" ? fallback : Number(v));
const date = (v: unknown) => (typeof v === "string" && v ? v.slice(0, 10) : null);

const planLabel: Record<string, string> = {
  care_plan: "Care Plan",
  hosting_only: "Hosting only",
  project: "Project",
};
const platformLabel: Record<string, Platform> = {
  wordpress: "WordPress",
  custom_php: "Custom PHP",
  shopify: "Shopify",
  other: "Other",
};
const statusLabel: Record<string, Request["status"]> = {
  new: "New",
  in_progress: "In progress",
  awaiting_approval: "Awaiting approval",
  done: "Done",
  follow_up_due: "Follow-up due",
};
const priorityLabel: Record<string, Request["priority"]> = {
  low: "Low",
  normal: "Normal",
  urgent: "Urgent",
};

/** Loads everything from Supabase, or returns demo data when Supabase is not configured. */
export async function getData(): Promise<AppData> {
  const supabase = await createClient();
  if (!supabase) return demoData;

  const [c, h, s, r] = await Promise.all([
    supabase.from("clients").select("*").order("name"),
    supabase.from("hostings").select("*").order("expires_on"),
    supabase.from("sites").select("*").order("name"),
    supabase.from("requests").select("*").order("received_at", { ascending: false }),
  ]);

  const failed = [c, h, s, r].find((x) => x.error);
  if (failed?.error) {
    return {
      source: "supabase",
      clients: [],
      hostings: [],
      sites: [],
      requests: [],
      error: failed.error.message,
    };
  }

  const clients: Client[] = ((c.data ?? []) as Row[]).map((x) => ({
    id: str(x.id),
    name: str(x.name),
    whatsapp: str(x.whatsapp, "—"),
    plan: planLabel[str(x.plan)] ?? "Project",
    monthly: num(x.monthly_amount),
  }));

  const hostings: Hosting[] = ((h.data ?? []) as Row[]).map((x) => ({
    id: str(x.id),
    provider: str(x.provider),
    plan: str(x.plan),
    panel: str(x.panel, "—"),
    ownedBy: x.owned_by === "client" ? "Client" : "RK Digital",
    expiry: date(x.expires_on),
    renewal: num(x.renewal_amount),
  }));

  const sites: Site[] = ((s.data ?? []) as Row[]).map((x) => {
    const status = str(x.status, "up");
    return {
      id: str(x.id),
      clientId: str(x.client_id),
      name: str(x.name),
      domain: str(x.domain),
      platform: platformLabel[str(x.platform)] ?? "Other",
      tier: (["A", "C", "D"].includes(str(x.tier)) ? str(x.tier) : "D") as Tier,
      hostingId: x.hosting_id ? str(x.hosting_id) : null,
      registrar: str(x.registrar),
      domainExpiry: date(x.domain_expires_on),
      sslExpiry: date(x.ssl_expires_on),
      status: status === "down" || status === "degraded" ? status : "up",
      uptime: num(x.uptime_pct, 100),
      responseMs: num(x.response_ms),
    };
  });

  const requests: Request[] = ((r.data ?? []) as Row[]).map((x) => ({
    id: str(x.id),
    clientId: str(x.client_id),
    siteId: x.site_id ? str(x.site_id) : null,
    message: str(x.message),
    category: str(x.category, "Question"),
    priority: priorityLabel[str(x.priority)] ?? "Normal",
    status: statusLabel[str(x.status)] ?? "New",
    receivedAt: str(x.received_at, new Date().toISOString()),
  }));

  return { source: "supabase", clients, hostings, sites, requests };
}
