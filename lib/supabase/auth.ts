import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

function randomPassword() {
  return `${crypto.randomUUID()}-${crypto.randomUUID()}`;
}

async function getOrCreateSupabaseAuthUser(email: string) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required when using NextAuth Google sign-in.");
  }

  const normalizedEmail = email.trim().toLowerCase();
  const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (listError) throw new Error(listError.message);

  const existing = existingUsers.users.find((candidate) => candidate.email?.toLowerCase() === normalizedEmail);
  if (existing) return existing;

  const { data, error } = await supabase.auth.admin.createUser({
    email: normalizedEmail,
    email_confirm: true,
    password: randomPassword(),
    user_metadata: {
      provider: "google"
    }
  });

  if (error) {
    const retry = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
    const created = retry.data.users.find((candidate) => candidate.email?.toLowerCase() === normalizedEmail);
    if (created) return created;
    throw new Error(error.message);
  }

  if (!data.user) throw new Error("Could not create Supabase user for Google account.");
  return data.user;
}

export async function requireUser() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required when using NextAuth Google sign-in.");
  }

  const authUser = await getOrCreateSupabaseAuthUser(session.user.email);
  const user = {
    id: authUser.id,
    email: authUser.email ?? session.user.email,
    name: session.user.name,
    image: session.user.image
  };

  return { user, supabase };
}
