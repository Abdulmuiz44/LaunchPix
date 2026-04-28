import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function createSupabaseServerClient() {
  const admin = createSupabaseAdminClient();
  if (admin) return admin;

  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: any[]) {
          cookiesToSet.forEach(({ name, value, options }: any) => {
            try {
              cookieStore.set(name, value, options);
            } catch (error) {
              const message = error instanceof Error ? error.message : "";
              if (!message.includes("Cookies can only be modified in a Server Action or Route Handler")) {
                throw error;
              }
              // In Server Components, cookie writes are blocked. Supabase can still function
              // for read-only requests, so we safely skip writes in this context.
            }
          });
        }
      }
    }
  );
}
