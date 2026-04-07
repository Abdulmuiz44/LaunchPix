import type { ProjectStatus } from "@/lib/validation/project";

export interface ProjectRecord {
  id: string;
  user_id: string;
  name: string;
  product_type: string;
  platform: string;
  description: string;
  audience: string;
  website_url: string | null;
  primary_color: string | null;
  style_prompt: string | null;
  style_preset: string;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
}

export interface UploadRecord {
  id: string;
  project_id: string;
  file_url: string;
  normalized_url: string | null;
  original_filename: string;
  mime_type: string;
  width: number | null;
  height: number | null;
  file_size: number | null;
  position: number;
  created_at: string;
}

export interface GenerationRecord {
  id: string;
  project_id: string;
  status: "draft" | "queued" | "analyzing" | "generating_copy" | "rendering_assets" | "completed" | "failed";
  ai_summary: Record<string, unknown> | null;
  copy_json: Record<string, unknown> | null;
  style_json: Record<string, unknown> | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface AssetRecord {
  id: string;
  generation_id: string;
  asset_type: string;
  width: number;
  height: number;
  file_url: string;
  preview_url: string | null;
  metadata_json: Record<string, unknown> | null;
  created_at: string;
}
