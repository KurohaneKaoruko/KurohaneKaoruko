import { cn } from "@/lib/utils";

export function StatusStamp({
  text = "ACTIVE",
  className,
}: {
  text?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute right-3 top-3 rotate-3 border border-active/60 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-active/80 opacity-80",
        className
      )}
    >
      {text}
    </span>
  );
}
