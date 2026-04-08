import { z } from "zod";

export const PRODUCT_TYPE_OPTIONS = [
  "browser_extension",
  "saas",
  "web_app",
  "mobile_app",
  "other"
] as const;

export const PLATFORM_OPTIONS = [
  "chrome_web_store",
  "firefox_addons",
  "product_launch",
  "saas_marketing",
  "general_promo"
] as const;

export const STYLE_PRESET_OPTIONS = ["minimal", "bold", "dark", "gradient", "corporate"] as const;

export const PROJECT_STATUS_OPTIONS = ["draft", "ready", "queued", "analyzing", "generating_copy", "rendering_assets", "generating", "completed", "failed"] as const;

const optionalWebsiteUrlSchema = z.preprocess((value) => {
  if (typeof value !== "string") return value;

  const trimmedValue = value.trim();
  if (!trimmedValue) return "";

  if (/^https?:\/\//i.test(trimmedValue)) {
    return trimmedValue;
  }

  return `https://${trimmedValue}`;
}, z.union([z.literal(""), z.string().url("Enter a valid URL.")]));

export const defineIdentitySchema = z.object({
  name: z.string().min(2, "Project name is required."),
  productType: z.enum(PRODUCT_TYPE_OPTIONS),
  platform: z.enum(PLATFORM_OPTIONS),
  description: z.string().min(10, "Add a one-sentence product description."),
  audience: z.string().min(3, "Target audience is required."),
  websiteUrl: optionalWebsiteUrlSchema.optional(),
  primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6})$/, "Use a hex color like #4F46E5."),
  stylePreset: z.enum(STYLE_PRESET_OPTIONS)
});

export const styleDirectionSchema = z.object({
  stylePrompt: z.string().max(400, "Style prompt should be under 400 characters.").optional().default("")
});

export const uploadMetadataSchema = z.object({
  originalFilename: z.string().min(1),
  mimeType: z.enum(["image/png", "image/jpeg", "image/webp"]),
  fileSize: z.number().int().positive().max(10 * 1024 * 1024),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  position: z.number().int().min(0)
});

export const createProjectSchema = defineIdentitySchema.extend({
  userId: z.string().uuid()
});

export type DefineIdentityInput = z.infer<typeof defineIdentitySchema>;
export type StyleDirectionInput = z.infer<typeof styleDirectionSchema>;
export type UploadMetadataInput = z.infer<typeof uploadMetadataSchema>;
export type ProjectStatus = (typeof PROJECT_STATUS_OPTIONS)[number];
