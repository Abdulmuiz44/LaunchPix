import { Resvg } from "@resvg/resvg-js";
import type { GenerationPlan } from "@/lib/ai/schemas/asset-plan";
import type { UploadRecord } from "@/types/project";
import { renderAssetSvg } from "@/lib/render/primitives/svg";

export async function renderAssetPng(input: {
  width: number;
  height: number;
  templateFamily: "minimal" | "bold" | "dark" | "gradient";
  headline: string;
  subheadline: string;
  callouts: string[];
  cta: string;
  screenshotUrls: string[];
  primaryColor?: string | null;
  watermarkText?: string;
}) {
  const svg = renderAssetSvg(input);
  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: input.width } });
  return resvg.render().asPng();
}

export function buildDeterministicAssets(plan: GenerationPlan, uploads: UploadRecord[]) {
  const ordered = [...uploads].sort((a, b) => a.position - b.position);
  const screenshotById = new Map(ordered.map((u) => [u.id, u.file_url]));

  return plan.assets.map((asset, index) => {
    const screenshotUrls = asset.screenshot_ids.map((id) => screenshotById.get(id)).filter(Boolean) as string[];
    return {
      key: `asset-${index + 1}`,
      ...asset,
      screenshotUrls: screenshotUrls.length ? screenshotUrls : ordered.slice(0, 1).map((u) => u.file_url)
    };
  });
}
