export function buildGenerationPrompt(input: {
  name: string;
  productType: string;
  platform: string;
  description: string;
  audience: string;
  stylePreset: string;
  stylePrompt?: string | null;
  uploads: Array<{ id: string; file_url: string; position: number }>;
}) {
  return `You are a conversion-focused creative strategist for SaaS launch graphics.
Return strict JSON only.

Project:
- Name: ${input.name}
- Product Type: ${input.productType}
- Platform: ${input.platform}
- Description: ${input.description}
- Audience: ${input.audience}
- Style preset: ${input.stylePreset}
- Style prompt: ${input.stylePrompt || "none"}

Uploads (ordered):
${input.uploads.map((u) => `- ${u.id} | position=${u.position} | url=${u.file_url}`).join("\n")}

Rules:
- Use concise, credible copy.
- Avoid hype and generic filler.
- Keep text layout-safe.
- Return one JSON object with these exact top-level keys:
  product_summary, value_proposition, target_audience_summary, headline_options,
  selected_headline, subheadline, feature_callouts, cta_line, color_guidance,
  recommended_template_family, screenshot_emphasis, assets.
- color_guidance must contain background_style, accent_usage, contrast_mode.
- headline_options must contain exactly 3 strings.
- assets must contain exactly 7 objects.
- Each asset must contain asset_type, width, height, headline, subheadline,
  callouts, screenshot_ids, template_family, notes.
- Generate exactly 7 assets in order:
  1-5 listing screenshot (1280x800)
  6 promo tile (440x280)
  7 hero banner (1400x560)
- Use template families: minimal, bold, dark, gradient.
- Reuse screenshots intelligently if fewer than 5 uploads.
- screenshot_ids must reference given upload IDs.
`;
}
