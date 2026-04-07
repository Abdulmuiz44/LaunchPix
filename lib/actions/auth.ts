"use server";

import { redirect } from "next/navigation";
import { buildAppUrl } from "@/lib/app-url";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function signInWithMagicLink(formData: FormData) {
  const email = String(formData.get("email") || "");
  if (!email) throw new Error("Email is required.");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: buildAppUrl("/auth/callback") }
  });

  if (error) throw new Error(error.message);
  redirect("/login?sent=1");
}
