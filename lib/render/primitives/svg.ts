import { getTemplatePalette, type TemplateFamily } from "@/lib/render/templates/registry";

function escapeXml(text: string) {
  return text.replace(/[<>&"']/g, (m) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" }[m] || m));
}

export function renderAssetSvg(input: {
  width: number;
  height: number;
  templateFamily: TemplateFamily;
  headline: string;
  subheadline: string;
  callouts: string[];
  cta: string;
  screenshotUrls: string[];
  primaryColor?: string | null;
  watermarkText?: string;
}) {
  const p = getTemplatePalette(input.templateFamily, input.primaryColor);
  const callouts = input.callouts
    .slice(0, 3)
    .map((c, i) => `<text x="70" y="${340 + i * 54}" fill="${p.text}" font-size="30" font-weight="600">• ${escapeXml(c)}</text>`)
    .join("\n");
  const shots = input.screenshotUrls
    .slice(0, 2)
    .map(
      (_, i) => `<rect x="${input.width - 560 + i * 270}" y="${input.height - 280}" width="240" height="160" rx="16" fill="#ffffff22" stroke="#ffffff44" />
<text x="${input.width - 540 + i * 270}" y="${input.height - 190}" fill="${p.text}" font-size="16">Screenshot ${i + 1}</text>`
    )
    .join("\n");

  const watermark = input.watermarkText
    ? `<text x="${input.width - 20}" y="${input.height - 18}" fill="#00000066" font-size="20" text-anchor="end">${escapeXml(input.watermarkText)}</text>`
    : "";

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${input.width}" height="${input.height}">
<rect width="100%" height="100%" fill="${p.bg}"/>
<rect x="40" y="40" width="${input.width - 80}" height="${input.height - 80}" rx="28" fill="${p.panel}" />
<rect x="70" y="70" width="10" height="90" rx="5" fill="${p.accent}" />
<text x="96" y="125" fill="${p.text}" font-size="52" font-weight="800">${escapeXml(input.headline.slice(0, 65))}</text>
<text x="70" y="190" fill="${p.text}" opacity="0.8" font-size="28" font-weight="500">${escapeXml(input.subheadline.slice(0, 95))}</text>
${callouts}
<rect x="70" y="${input.height - 130}" width="300" height="54" rx="27" fill="${p.accent}" />
<text x="95" y="${input.height - 95}" fill="#fff" font-size="24" font-weight="700">${escapeXml(input.cta.slice(0, 28))}</text>
${shots}
${watermark}
</svg>`;
}
