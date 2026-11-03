// Shared types, demo data (used when Supabase is not connected) and pure helpers.

import { daysUntil } from "./dates";

export type Platform = "WordPress" | "Custom PHP" | "Shopify" | "Other";
export type Tier = "A" | "C" | "D";

export interface Client {
  id: string;
  name: string;
  whatsapp: string;
  plan: string;
  monthly: number; // USD retainer
}

export interface Hosting {
  id: string;
  provider: string;
  plan: string;
  panel: string;
  ownedBy: "RK Digital" | "Client";
  expiry: string | null;
  renewal: number;
}

export interface Site {
  id: string;
  clientId: string;
  name: string;
  domain: string;
  platform: Platform;
  tier: Tier;
  hostingId: string | null;
  registrar: string;
  domainExpiry: string | null;
  sslExpiry: string | null;
  status: "up" | "degraded" | "down";
  uptime: number;
  responseMs: number;
}

export interface Request {
  id: string;
  clientId: string;
  siteId: string | null;
  message: string;
  category: string;
  priority: "Low" | "Normal" | "Urgent";
  status: "New" | "In progress" | "Awaiting approval" | "Done" | "Follow-up due";
  receivedAt: string;
}

export interface AppData {
  clients: Client[];
  hostings: Hosting[];
  sites: Site[];
  requests: Request[];
  source: "demo" | "supabase";
  error?: string;
}

// DEMO DATA — placeholder records shown only when Supabase is not connected.
export const demoData: AppData = {
  source: "demo",
  clients: [
    { id: "c1", name: "Jeff", whatsapp: "+00 000 000 0001", plan: "Care Plan", monthly: 150 },
    { id: "c2", name: "Noman", whatsapp: "+00 000 000 0002", plan: "Hosting only", monthly: 45 },
  ],
  hostings: [
    { id: "h1", provider: "Hostinger", plan: "Business Web Hosting", panel: "hPanel", ownedBy: "RK Digital", expiry: "2027-03-18", renewal: 96 },
    { id: "h2", provider: "cPanel host", plan: "Shared Pro", panel: "cPanel", ownedBy: "RK Digital", expiry: "2026-11-21", renewal: 72 },
    { id: "h3", provider: "cPanel host", plan: "Reseller Starter", panel: "cPanel", ownedBy: "Client", expiry: "2026-12-29", renewal: 120 },
    { id: "h4", provider: "Hostinger", plan: "Premium Web Hosting", panel: "hPanel", ownedBy: "RK Digital", expiry: "2027-01-09", renewal: 60 },
  ],
  sites: [
    { id: "s1", clientId: "c1", name: "Jeff — Main Site", domain: "jeff-site-1.example", platform: "WordPress", tier: "A", hostingId: "h1", registrar: "Namecheap", domainExpiry: "2026-11-09", sslExpiry: "2027-01-30", status: "up", uptime: 99.98, responseMs: 412 },
    { id: "s2", clientId: "c1", name: "Jeff — Store", domain: "jeff-site-2.example", platform: "WordPress", tier: "A", hostingId: "h1", registrar: "Namecheap", domainExpiry: "2027-06-14", sslExpiry: "2027-01-30", status: "up", uptime: 99.95, responseMs: 538 },
    { id: "s3", clientId: "c1", name: "Jeff — Landing", domain: "jeff-site-3.example", platform: "Custom PHP", tier: "C", hostingId: "h2", registrar: "GoDaddy", domainExpiry: "2026-12-02", sslExpiry: "2026-11-27", status: "degraded", uptime: 99.4, responseMs: 1280 },
    { id: "s4", clientId: "c1", name: "Jeff — Blog", domain: "jeff-site-4.example", platform: "WordPress", tier: "A", hostingId: "h2", registrar: "GoDaddy", domainExpiry: "2027-02-11", sslExpiry: "2026-11-27", status: "up", uptime: 99.9, responseMs: 604 },
    { id: "s5", clientId: "c1", name: "Jeff — Portal", domain: "jeff-site-5.example", platform: "Custom PHP", tier: "C", hostingId: "h4", registrar: "Namecheap", domainExpiry: "2027-04-03", sslExpiry: "2027-02-14", status: "up", uptime: 100, responseMs: 297 },
    { id: "s6", clientId: "c2", name: "Noman — Main Site", domain: "noman-site-1.example", platform: "WordPress", tier: "D", hostingId: "h3", registrar: "Hostinger", domainExpiry: "2026-11-30", sslExpiry: "2026-12-19", status: "up", uptime: 99.97, responseMs: 471 },
    { id: "s7", clientId: "c2", name: "Noman — Catalog", domain: "noman-site-2.example", platform: "WordPress", tier: "D", hostingId: "h3", registrar: "Hostinger", domainExpiry: "2027-05-22", sslExpiry: "2026-12-19", status: "down", uptime: 97.2, responseMs: 0 },
    { id: "s8", clientId: "c2", name: "Noman — Landing", domain: "noman-site-3.example", platform: "Custom PHP", tier: "C", hostingId: "h4", registrar: "Hostinger", domainExpiry: "2027-08-08", sslExpiry: "2027-02-14", status: "up", uptime: 99.99, responseMs: 255 },
  ],
  requests: [
    { id: "r1", clientId: "c1", siteId: "s1", message: "Homepage hero text change karna hai, new offer lagana hai.", category: "Content change", priority: "Normal", status: "Awaiting approval", receivedAt: "2026-11-03T14:20:00Z" },
    { id: "r2", clientId: "c1", siteId: "s3", message: "Contact form email nahi aa rahi, check kar dein.", category: "Bug / issue", priority: "Urgent", status: "In progress", receivedAt: "2026-11-04T05:42:00Z" },
    { id: "r3", clientId: "c2", siteId: "s7", message: "Catalog page open nahi ho raha.", category: "Bug / issue", priority: "Urgent", status: "New", receivedAt: "2026-11-04T07:05:00Z" },
    { id: "r4", clientId: "c1", siteId: "s2", message: "New product category add karni hai.", category: "Content change", priority: "Low", status: "Follow-up due", receivedAt: "2026-10-30T10:10:00Z" },
    { id: "r5", clientId: "c2", siteId: "s6", message: "Kya SSL renew ho gaya?", category: "Question", priority: "Normal", status: "Done", receivedAt: "2026-10-29T08:55:00Z" },
  ],
};

// ---------- helpers ----------

export function lookups(d: AppData) {
  return {
    clientName: (id: string) => d.clients.find((c) => c.id === id)?.name ?? "Unknown",
    site: (id: string | null) => (id ? d.sites.find((s) => s.id === id) : undefined),
    hosting: (id: string | null) => (id ? d.hostings.find((h) => h.id === id) : undefined),
  };
}

export type ExpiryKind = "Domain" | "Hosting" | "SSL";

export interface ExpiryItem {
  id: string;
  kind: ExpiryKind;
  label: string;
  client: string;
  owner: string;
  date: string;
  days: number;
  amount?: number;
}

export function getExpiries(d: AppData): ExpiryItem[] {
  const { clientName } = lookups(d);
  const items: ExpiryItem[] = [];

  for (const s of d.sites) {
    const client = clientName(s.clientId);
    if (s.domainExpiry) {
      items.push({
        id: `${s.id}-domain`,
        kind: "Domain",
        label: s.domain,
        client,
        owner: s.registrar || "Registrar not set",
        date: s.domainExpiry,
        days: daysUntil(s.domainExpiry),
      });
    }
    if (s.sslExpiry) {
      items.push({
        id: `${s.id}-ssl`,
        kind: "SSL",
        label: s.domain,
        client,
        owner: "Let's Encrypt / host",
        date: s.sslExpiry,
        days: daysUntil(s.sslExpiry),
      });
    }
  }

  for (const h of d.hostings) {
    if (!h.expiry) continue;
    const users = Array.from(
      new Set(d.sites.filter((s) => s.hostingId === h.id).map((s) => clientName(s.clientId))),
    ).join(", ");
    items.push({
      id: `${h.id}-hosting`,
      kind: "Hosting",
      label: `${h.provider}${h.plan ? ` — ${h.plan}` : ""}`,
      client: users || "—",
      owner: h.ownedBy === "RK Digital" ? "Paid by RK Digital" : "Paid by client",
      date: h.expiry,
      days: daysUntil(h.expiry),
      amount: h.renewal || undefined,
    });
  }

  return items.sort((a, b) => a.days - b.days);
}
