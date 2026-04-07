import { z } from "zod";

export const templateFamilySchema = z.enum(["minimal", "bold", "dark", "gradient"]);

export const assetPlanItemSchema = z.object({
  asset_type: z.string(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  headline: z.string().max(80),
  subheadline: z.string().max(120),
  callouts: z.array(z.string().max(48)).max(3),
  screenshot_ids: z.array(z.string().uuid()).min(1),
  template_family: templateFamilySchema,
  notes: z.string().max(200)
});

export const generationPlanSchema = z.object({
  product_summary: z.string().max(280),
  value_proposition: z.string().max(220),
  target_audience_summary: z.string().max(180),
  headline_options: z.array(z.string().max(80)).min(3).max(3),
  selected_headline: z.string().max(80),
  subheadline: z.string().max(120),
  feature_callouts: z.array(z.string().max(48)).min(1).max(5),
  cta_line: z.string().max(40),
  color_guidance: z.object({
    background_style: z.string().max(40),
    accent_usage: z.string().max(80),
    contrast_mode: z.string().max(40)
  }),
  recommended_template_family: templateFamilySchema,
  screenshot_emphasis: z.array(z.object({ upload_id: z.string().uuid(), priority: z.number().int().min(1).max(5), reason: z.string().max(120) })).max(5),
  assets: z.array(assetPlanItemSchema).length(7)
});

export type GenerationPlan = z.infer<typeof generationPlanSchema>;
export type AssetPlanItem = z.infer<typeof assetPlanItemSchema>;
