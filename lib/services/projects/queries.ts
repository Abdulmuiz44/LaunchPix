import { notFound } from "next/navigation";
import type { ProjectRecord, UploadRecord } from "@/types/project";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function listUserProjects(userId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*, uploads(count), generations(status)")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as (ProjectRecord & { uploads: { count: number }[]; generations: { status: string }[] })[];
}

export async function getProjectForUser(projectId: string, userId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .eq("user_id", userId)
    .single();

  if (error || !data) notFound();
  return data as ProjectRecord;
}

export async function getProjectUploads(projectId: string, userId: string) {
  const supabase = await createSupabaseServerClient();
  const { data: project } = await supabase.from("projects").select("id").eq("id", projectId).eq("user_id", userId).single();

  if (!project) notFound();

  const { data, error } = await supabase.from("uploads").select("*").eq("project_id", projectId).order("position");
  if (error) throw new Error(error.message);
  return (data ?? []) as UploadRecord[];
}

export async function getProjectOverview(projectId: string, userId: string) {
  const [project, uploads] = await Promise.all([getProjectForUser(projectId, userId), getProjectUploads(projectId, userId)]);
  return { project, uploads };
}
