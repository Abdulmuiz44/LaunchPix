import { NextResponse } from "next/server";
import { requireUser } from "@/lib/supabase/auth";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, supabase } = await requireUser();
  const { id } = await params;
  const body = (await req.json()) as { ids: string[] };

  const { data: project } = await supabase.from("projects").select("id").eq("id", id).eq("user_id", user.id).single();
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

  await Promise.all(
    body.ids.map((uploadId, index) =>
      supabase.from("uploads").update({ position: index }).eq("id", uploadId).eq("project_id", id)
    )
  );

  return NextResponse.json({ ok: true });
}
