import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  subValue?: string;
  badge?: {
    text: string;
    variant: "success" | "warning";
  };
}

export function StatCard({
  icon: Icon,
  label,
  value,
  subValue,
  badge,
}: StatCardProps) {
  return (
    <div className="stat-card flex flex-col gap-2 lg:gap-3 p-3 lg:p-4">
      <div className="flex items-start justify-between">
        <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
        </div>
        {badge && (
          <span
            className={cn(
              "text-[10px] lg:text-xs",
              badge.variant === "success"
                ? "compliance-badge-success"
                : "compliance-badge-warning",
            )}
          >
            {badge.text}
          </span>
        )}
      </div>
      <div className="space-y-0.5 lg:space-y-1">
        <p className="text-lg lg:text-2xl font-semibold text-foreground font-mono">
          {value}
        </p>
        <p className="text-xs lg:text-sm text-muted-foreground leading-tight">
          {label}
        </p>
        {subValue && (
          <p className="text-[10px] lg:text-xs text-muted-foreground/70">
            {subValue}
          </p>
        )}
      </div>
    </div>
  );
}
