import { NextResponse } from "next/server";
import { requireUser } from "@/lib/supabase/auth";
import { uploadMetadataSchema } from "@/lib/validation/project";
import { enqueueNormalization } from "@/lib/services/uploads/normalization";
import { trackEvent } from "@/lib/services/analytics/events";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, supabase } = await requireUser();
  const { id } = await params;

  const { data: project } = await supabase.from("projects").select("id,name").eq("id", id).eq("user_id", user.id).single();
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

  const form = await req.formData();
  const file = form.get("file");
  const position = Number(form.get("position") ?? 0);

  if (!(file instanceof File)) return NextResponse.json({ error: "Missing file" }, { status: 400 });

  const metaParse = uploadMetadataSchema.safeParse({
    originalFilename: file.name,
    mimeType: file.type,
    fileSize: file.size,
    position
  });

  if (!metaParse.success) return NextResponse.json({ error: metaParse.error.issues[0]?.message }, { status: 400 });

  const bucket = "project-uploads-raw";
  const path = `${user.id}/${id}/${crypto.randomUUID()}-${file.name}`;
  const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, { upsert: false, contentType: file.type });
  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path);

  const { data, error } = await supabase
    .from("uploads")
    .insert({
      project_id: id,
      file_url: pub.publicUrl,
      original_filename: file.name,
      mime_type: file.type,
      file_size: file.size,
      position
    })
    .select("*")
    .single();

  if (error || !data) return NextResponse.json({ error: error?.message || "Could not save upload" }, { status: 500 });

  await enqueueNormalization(data.id);
  await trackEvent({ userId: user.id, projectId: id, eventType: "screenshots_uploaded", metadata: { uploadId: data.id, projectName: project.name } });
  return NextResponse.json({ upload: data });
}
