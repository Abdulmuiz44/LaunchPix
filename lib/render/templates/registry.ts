export type TemplateFamily = "minimal" | "bold" | "dark" | "gradient";

const palettes: Record<TemplateFamily, { bg: string; panel: string; text: string; accent: string }> = {
  minimal: { bg: "#F8FAFC", panel: "#FFFFFF", text: "#0F172A", accent: "#4F46E5" },
  bold: { bg: "#EEF2FF", panel: "#C7D2FE", text: "#1E1B4B", accent: "#4338CA" },
  dark: { bg: "#0B1220", panel: "#121A2D", text: "#E2E8F0", accent: "#7C3AED" },
  gradient: { bg: "#EEF2FF", panel: "#FFFFFF", text: "#111827", accent: "#8B5CF6" }
};

export function getTemplatePalette(family: TemplateFamily, primaryColor?: string | null) {
  const base = palettes[family] ?? palettes.minimal;
  return { ...base, accent: primaryColor || base.accent };
}
