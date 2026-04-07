import { Mistral } from "@mistralai/mistralai";
import { generationPlanSchema, type GenerationPlan } from "@/lib/ai/schemas/asset-plan";
import { buildGenerationPrompt } from "@/lib/ai/prompts/generation";

const visionModel = process.env.MISTRAL_MODEL_VISION || "mistral-small-2506";
const textModel = process.env.MISTRAL_MODEL_TEXT || "mistral-small-2506";

function redactError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return message.replaceAll(process.env.MISTRAL_API_KEY || "", "[redacted]");
}

export async function mistralGenerateAssetPlan(input: {
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
}): Promise<GenerationPlan> {
  if (!process.env.MISTRAL_API_KEY) {
    throw new Error("MISTRAL_API_KEY is missing.");
  }

  const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

  const prompt = buildGenerationPrompt({
    name: input.project.name,
    productType: input.project.product_type,
    platform: input.project.platform,
    description: input.project.description,
    audience: input.project.audience,
    stylePreset: input.project.style_preset,
    stylePrompt: input.project.style_prompt,
    uploads: input.uploads
  });

  try {
    const response = await client.chat.complete({
      model: visionModel,
      responseFormat: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "You produce strict JSON plans for deterministic SaaS launch graphic rendering."
        },
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            ...input.uploads.map((u) => ({ type: "image_url", imageUrl: u.file_url }))
          ]
        }
      ]
    });

    const raw = response.choices?.[0]?.message?.content;
    const text = Array.isArray(raw) ? raw.map((x: any) => (x.type === "text" ? x.text : "")).join(" ") : String(raw || "{}");
    const parsedJson = JSON.parse(text);
    return generationPlanSchema.parse(parsedJson);
  } catch (error) {
    console.error("Mistral generation failed:", redactError(error));
    throw new Error("Unable to generate plan with Mistral.");
  }
}

export const mistralModels = { visionModel, textModel };
