import { cn } from "@/lib/utils";

export function MultiStepShell({ step }: { step: number }) {
  const steps = ["Define identity", "Upload screenshots", "Choose visual direction"];

  return (
    <div className="grid gap-3 md:grid-cols-3">
      {steps.map((label, i) => (
        <div
          key={label}
          className={cn(
            "dashboard-card-muted p-4 text-sm",
            step === i + 1 ? "border border-violet-400/20 bg-violet-400/10" : ""
          )}
        >
          <p className="dashboard-label">Step {i + 1}</p>
          <p className="mt-2 font-semibold text-white">{label}</p>
        </div>
      ))}
    </div>
  );
}
