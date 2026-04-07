import type { GenerationPlan } from "@/lib/ai/schemas/asset-plan";

export interface AIAdapter {
  generateAssetPlan(input: {
    project: {
      name: string;
      product_type: string;
      platform: string;
      description: string;
      audience: string;
      style_preset: string;
      style_prompt: string | null;
    };
    uploads: Array<{ id: string; file_url: string; position: number }>;
  }): Promise<GenerationPlan>;
}
