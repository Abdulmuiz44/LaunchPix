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
- Generate exactly 7 assets in order:
  1-5 listing screenshot (1280x800)
  6 promo tile (440x280)
  7 hero banner (1400x560)
- Use template families: minimal, bold, dark, gradient.
- Reuse screenshots intelligently if fewer than 5 uploads.
- screenshot_ids must reference given upload IDs.
`;
}
