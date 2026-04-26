import { cn } from "@/lib/utils";

export function LaunchPixLogo({ className, markClassName }: { className?: string; markClassName?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <span
        className={cn(
          "relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-[15px] bg-slate-950 shadow-[0_18px_42px_-28px_rgba(15,23,42,0.7)] dark:bg-white",
          markClassName
        )}
      >
        <svg viewBox="0 0 40 40" aria-hidden="true" className="size-8">
          <defs>
            <linearGradient id="launchpix-mark-a" x1="8" y1="5" x2="34" y2="35" gradientUnits="userSpaceOnUse">
              <stop stopColor="#22D3EE" />
              <stop offset="1" stopColor="#7C3AED" />
            </linearGradient>
            <linearGradient id="launchpix-mark-b" x1="10" y1="31" x2="31" y2="10" gradientUnits="userSpaceOnUse">
              <stop stopColor="#E0F2FE" />
              <stop offset="1" stopColor="#93C5FD" />
            </linearGradient>
          </defs>
          <path d="M9 8.5C9 6.57 10.57 5 12.5 5h5.25v21.25H31V31.5c0 1.93-1.57 3.5-3.5 3.5h-15A3.5 3.5 0 0 1 9 31.5v-23Z" fill="url(#launchpix-mark-a)" />
          <path d="M18.5 5H27a4 4 0 0 1 4 4v8.5L18.5 30V5Z" fill="url(#launchpix-mark-b)" opacity="0.92" />
          <path d="M27.2 9.4l1.1 3.2 3.3 1.1-3.3 1.2-1.1 3.2-1.2-3.2-3.2-1.2 3.2-1.1 1.2-3.2Z" fill="#FFFFFF" />
        </svg>
      </span>
      <span className="min-w-0">
        <span className="block text-lg font-semibold leading-tight text-slate-950 dark:text-white">LaunchPix</span>
        <span className="block text-xs text-slate-500">Launch studio</span>
      </span>
    </span>
  );
}
