import type { ReactNode } from "react";
import { Sidebar } from "@/components/Sidebar";
import { supabaseEnv } from "@/lib/supabase/env";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Sidebar authEnabled={supabaseEnv() !== null} />
      <main id="main" className="px-4 pb-28 pt-24 lg:ml-72 lg:px-8 lg:pb-12 lg:pt-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </>
  );
}
