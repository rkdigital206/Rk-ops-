import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseEnv } from "./env";

/** Returns null when Supabase is not configured (demo mode). */
export async function createClient() {
  const env = supabaseEnv();
  if (!env) return null;
  const store = await cookies();

  return createServerClient(env.url, env.key, {
    cookies: {
      getAll() {
        return store.getAll();
      },
      setAll(list) {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // Called from a Server Component: cookies are refreshed by middleware instead.
        }
      },
    },
  });
}
