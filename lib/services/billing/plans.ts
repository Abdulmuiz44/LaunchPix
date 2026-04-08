export type PlanId = "free" | "launch_pack" | "starter" | "pro";
export type BillingType = "free" | "one_time" | "monthly";

export interface PlanConfig {
  id: PlanId;
  label: string;
  billingType: BillingType;
  creditsGranted: number;
  fullResolutionExport: boolean;
  zipExport: boolean;
  watermarkPreview: boolean;
  commercialUse: boolean;
  priorityGeneration: boolean;
  maxProjects: number | null;
}

export const PLAN_CONFIG: Record<PlanId, PlanConfig> = {
  free: {
    id: "free",
    label: "Free",
    billingType: "free",
    creditsGranted: 3,
    fullResolutionExport: false,
    zipExport: false,
    watermarkPreview: true,
    commercialUse: false,
    priorityGeneration: false,
    maxProjects: 1
  },
  launch_pack: {
    id: "launch_pack",
    label: "Launch Pack",
    billingType: "one_time",
    creditsGranted: 15,
    fullResolutionExport: true,
    zipExport: true,
    watermarkPreview: false,
    commercialUse: true,
    priorityGeneration: false,
    maxProjects: null
  },
  starter: {
    id: "starter",
    label: "Starter",
    billingType: "monthly",
    creditsGranted: 25,
    fullResolutionExport: true,
    zipExport: true,
    watermarkPreview: false,
    commercialUse: true,
    priorityGeneration: false,
    maxProjects: null
  },
  pro: {
    id: "pro",
    label: "Pro",
    billingType: "monthly",
    creditsGranted: 80,
    fullResolutionExport: true,
    zipExport: true,
    watermarkPreview: false,
    commercialUse: true,
    priorityGeneration: true,
    maxProjects: null
  }
};

export const PLAN_ORDER: PlanId[] = ["free", "launch_pack", "starter", "pro"];
