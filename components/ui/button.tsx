import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-[14px] text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-[linear-gradient(135deg,#7c3aed,#9f67ff)] text-white shadow-[0_20px_48px_-24px_rgba(124,58,237,0.95)] hover:-translate-y-0.5 hover:brightness-110",
        outline: "border border-white/12 bg-[#111c33] text-slate-100 hover:border-cyan-400/30 hover:bg-[#15233d]",
        ghost: "text-slate-300 hover:bg-white/5 hover:text-white"
      },
      size: {
        default: "h-11 px-5 py-2.5",
        lg: "h-12 px-6 text-sm",
        sm: "h-9 rounded-xl px-3.5 text-[13px]"
      }
    },
    defaultVariants: { variant: "default", size: "default" }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
