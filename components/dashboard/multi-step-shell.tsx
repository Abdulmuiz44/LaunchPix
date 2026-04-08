import { cn } from "@/lib/utils";

export function MultiStepShell({ step }: { step: number }) {
  const steps = ["Define identity", "Upload screenshots", "Choose visual direction"];
  return (
    <div className="mb-6 grid gap-3 md:grid-cols-3">
      {steps.map((label, i) => (
        <div key={label} className={cn("surface-muted p-4 text-sm", step === i + 1 ? "border-primary/20 bg-primary/8" : "") }>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Step {i + 1}</p>
          <p className="mt-2 font-semibold text-foreground">{label}</p>
        </div>
      ))}
    </div>
  );
}
