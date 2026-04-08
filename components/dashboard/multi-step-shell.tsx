import { cn } from "@/lib/utils";

export function MultiStepShell({ step }: { step: number }) {
  const steps = ["Define identity", "Upload screenshots", "Choose visual direction"];
  return (
    <div className="mb-6 grid gap-3 md:grid-cols-3">
      {steps.map((label, i) => (
        <div key={label} className={cn("rounded-xl border p-3 text-sm", step === i + 1 ? "border-primary bg-primary/5" : "border-border")}>
          <p className="text-xs text-muted-foreground">Step {i + 1}</p>
          <p className="font-medium">{label}</p>
        </div>
      ))}
    </div>
  );
}
