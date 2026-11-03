import { redirect } from "next/navigation";
import { LoginForm } from "@/components/LoginForm";
import { supabaseEnv } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  // Demo mode: nothing to log in to.
  if (!supabaseEnv()) redirect("/");

  return (
    <main id="main" className="grid min-h-screen place-items-center px-4 py-10">
      <div className="glass-strong w-full max-w-md p-8">
        <span
          className="grid h-12 w-12 place-items-center rounded-2xl border border-white/20 bg-gradient-to-br from-royal to-cyan font-heading font-extrabold text-white"
          aria-hidden="true"
        >
          RK
        </span>
        <h1 className="mt-6 text-3xl font-extrabold text-white">Sign in to RK Ops</h1>
        <p className="mt-2 text-sm text-slate-300">Private workspace. Sirf authorised owner access kar sakta hai.</p>
        <LoginForm />
      </div>
    </main>
  );
}
