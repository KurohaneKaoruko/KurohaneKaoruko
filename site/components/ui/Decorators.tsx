import { cn } from "@/lib/utils";

export function RulerLine({
  className,
  vertical = false,
}: {
  className?: string;
  vertical?: boolean;
}) {
  return (
    <div
      className={cn(
        "opacity-30",
        vertical ? "tech-ruler-v" : "tech-ruler-h",
        className
      )}
    />
  );
}

export function Crosshair({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-4 w-4", className)}>
      <div className="absolute left-0 top-1/2 h-px w-full bg-primary/50" />
      <div className="absolute left-1/2 top-0 h-full w-px bg-primary/50" />
    </div>
  );
}

export function DataTag({
  label,
  value,
  className,
}: {
  label: string;
  value?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider",
        className
      )}
    >
      <span className="text-text-dim">{label}</span>
      {value && <span className="text-primary">{value}</span>}
    </div>
  );
}

export function BracketCorner({
  position = "top-left",
  className,
}: {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className?: string;
}) {
  const styles = {
    "top-left": "top-0 left-0 border-t-2 border-l-2",
    "top-right": "top-0 right-0 border-t-2 border-r-2",
    "bottom-left": "bottom-0 left-0 border-b-2 border-l-2",
    "bottom-right": "bottom-0 right-0 border-b-2 border-r-2",
  };

  return (
    <div
      className={cn(
        "absolute h-4 w-4 border-primary/50",
        styles[position],
        className
      )}
    />
  );
}
