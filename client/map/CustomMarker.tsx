import { CustomMarkerProps } from "../types";
import { useMapConfig } from "./useMapConfig";

export function CustomMarker({ type, label }: CustomMarkerProps) {
  const { markerStyles, markerIcons } = useMapConfig();
  const Icon = markerIcons[type];

  return (
    <div className="relative group cursor-pointer">
      <div
        className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-110 ${markerStyles[type]}`}
      >
        <Icon className="w-4 h-4 lg:w-5 lg:h-5" />
      </div>
      {/* Pulse ring for origin/destination */}
      {(type === "origin" || type === "destination" || type === "current") && (
        <div
          className={`absolute inset-0 rounded-full animate-ping opacity-30 ${
            type === "origin" || type === "current"
              ? "bg-primary"
              : "bg-success"
          }`}
          style={{ animationDuration: "2s" }}
        />
      )}
      {/* Tooltip */}
      {label && (
        <div className="absolute left-1/2 -translate-x-1/2 -top-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
          <div className="bg-secondary text-popover-foreground text-xs px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl border border-border/50 backdrop-blur-sm">
            {label}
          </div>
        </div>
      )}
    </div>
  );
}

export function CustomFuelMarker({ type, label }: CustomMarkerProps) {
  const { markerStyles, markerIcons } = useMapConfig();
  const Icon = markerIcons[type];
  return (
    <div className="relative group cursor-pointer">
      <div
        className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-110 ${markerStyles[type]}`}
      >
        <Icon className="w-4 h-4 lg:w-5 lg:h-5" />
      </div>
      {/* Tooltip */}
      {label && (
        <div className="absolute left-1/2 -translate-x-1/2 -top-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
          <div className="bg-secondary text-popover-foreground text-xs px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl border border-border/50 backdrop-blur-sm">
            {label}
          </div>
        </div>
      )}
    </div>
  );
}
