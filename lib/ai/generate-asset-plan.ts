import type { AIAdapter } from "@/lib/ai/adapter";
import { mistralGenerateAssetPlan } from "@/lib/ai/mistral";

export const mistralAdapter: AIAdapter = {
  async generateAssetPlan(input) {
    return mistralGenerateAssetPlan(input);
  }
};
