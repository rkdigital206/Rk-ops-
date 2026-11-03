import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Sidebar } from "@/components/Sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "RK Ops | Client Operations",
  description:
    "RK Digital client operations: domains, hosting, expiry reminders, website health and WhatsApp requests in one place.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0B1220",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="relative min-h-screen overflow-x-hidden">
        {/* Ambient glass backdrop */}
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-royal/40 blur-[120px]" />
          <div className="absolute right-[-8rem] top-1/4 h-[26rem] w-[26rem] rounded-full bg-cyan/20 blur-[130px]" />
          <div className="absolute bottom-[-10rem] left-1/3 h-[30rem] w-[30rem] rounded-full bg-indigo-500/25 blur-[140px]" />
        </div>

        <a
          href="#main"
          className="sr-only z-50 rounded-lg bg-white px-4 py-2 text-navy focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>

        <Sidebar />

        <main id="main" className="px-4 pb-28 pt-24 lg:ml-72 lg:px-8 lg:pb-12 lg:pt-10">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </body>
    </html>
  );
}
