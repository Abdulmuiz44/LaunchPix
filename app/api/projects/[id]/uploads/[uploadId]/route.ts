import { NextResponse } from "next/server";
import { requireUser } from "@/lib/supabase/auth";

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string; uploadId: string }> }) {
  const { user, supabase } = await requireUser();
  const { id, uploadId } = await params;

  const { data: project } = await supabase.from("projects").select("id").eq("id", id).eq("user_id", user.id).single();
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

  const { data: upload } = await supabase.from("uploads").select("file_url").eq("id", uploadId).eq("project_id", id).single();
  if (!upload) return NextResponse.json({ error: "Upload not found" }, { status: 404 });

  const { error } = await supabase.from("uploads").delete().eq("id", uploadId).eq("project_id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
