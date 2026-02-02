import { Fuel, BedDouble, Building2, MapPin } from "lucide-react";
import { useRoute } from "@/client/contexts";
import { MapLog } from "../Home";

interface MapMarker {
  type: "fuel" | "rest" | "pickup" | "dropoff" | "current";
  label: string;
  position: { top: string; left: string };
}

const markers: MapMarker[] = [
  {
    type: "current",
    label: "Chicago, IL",
    position: { top: "25%", left: "45%" },
  },
  { type: "fuel", label: "Fuel Stop", position: { top: "35%", left: "52%" } },
  {
    type: "pickup",
    label: "Indianapolis",
    position: { top: "40%", left: "48%" },
  },
  { type: "rest", label: "Rest Area", position: { top: "55%", left: "55%" } },
  { type: "fuel", label: "Fuel Stop", position: { top: "65%", left: "58%" } },
  { type: "rest", label: "Rest Area", position: { top: "75%", left: "52%" } },
  {
    type: "dropoff",
    label: "Atlanta, GA",
    position: { top: "85%", left: "55%" },
  },
];

const markerStyles = {
  current: "bg-primary text-primary-foreground",
  fuel: "bg-warning text-warning-foreground",
  rest: "bg-purple-500 text-white",
  pickup: "bg-blue-500 text-white",
  dropoff: "bg-emerald-600 text-white",
};

const markerIcons = {
  current: MapPin,
  fuel: Fuel,
  rest: BedDouble,
  pickup: Building2,
  dropoff: Building2,
};

export function MapPlaceholder() {
  const { tab, tripInfoRef } = useRoute();
  const total_distance_miles = Number(
    (tripInfoRef.current?.totalDistanceMiles || 12.47).toFixed(2),
  );
  return (
    <div>
      {tab === "MapAndLog" && <MapLog />}
      {tab !== "MapAndLog" && (
        <div className="glass-panel h-62.5 sm:h-75 lg:h-100 relative overflow-hidden">
          {/* Map Background */}
          <div className="absolute inset-0 bg-linear-to-br from-secondary via-card to-secondary opacity-90" />

          {/* Grid Pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
            linear-gradient(hsl(var(--border)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)
          `,
              backgroundSize: "30px 30px",
            }}
          />

          {/* Route Line SVG */}
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
            <defs>
              <linearGradient
                id="routeGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity="0.8"
                />
                <stop
                  offset="100%"
                  stopColor="hsl(160, 84%, 60%)"
                  stopOpacity="0.8"
                />
              </linearGradient>
            </defs>
            <path
              d="M 280 100 Q 320 140 310 160 Q 300 180 320 220 Q 340 260 330 280 Q 320 300 340 340"
              fill="none"
              stroke="url(#routeGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="0"
              className="drop-shadow-lg"
            />
            {/* Animated pulse along route */}
            <circle r="5" fill="hsl(var(--primary))">
              <animateMotion
                dur="4s"
                repeatCount="indefinite"
                path="M 280 100 Q 320 140 310 160 Q 300 180 320 220 Q 340 260 330 280 Q 320 300 340 340"
              />
            </circle>
          </svg>

          {/* Markers */}
          {markers.map((marker, index) => {
            const Icon = markerIcons[marker.type];
            return (
              <div
                key={index}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 group cursor-pointer"
                style={{ top: marker.position.top, left: marker.position.left }}
              >
                <div
                  className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center shadow-lg ${markerStyles[marker.type]} transition-transform duration-200 group-hover:scale-110`}
                >
                  <Icon className="w-3 h-3 lg:w-4 lg:h-4" />
                </div>
                {/* Tooltip */}
                <div className="absolute left-1/2 -translate-x-1/2 -top-8 lg:-top-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <div className="bg-popover text-popover-foreground text-[10px] lg:text-xs px-2 py-1 rounded-md whitespace-nowrap shadow-lg">
                    {marker.label}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Map Legend */}
          <div className="absolute bottom-2 lg:bottom-4 left-10 lg:left-[60%] glass-panel p-2 lg:p-3 space-y-1 lg:space-y-2 z-20">
            <p className="text-[10px] lg:text-xs font-medium text-muted-foreground mb-1 lg:mb-2">
              Legend
            </p>
            <div className="flex flex-wrap gap-2 lg:gap-3 text-[10px] lg:text-xs">
              <div className="flex items-center gap-1 lg:gap-1.5">
                <div className="w-3 h-3 lg:w-4 lg:h-4 rounded-full bg-warning flex items-center justify-center">
                  <Fuel className="w-2 h-2 lg:w-2.5 lg:h-2.5 text-warning-foreground" />
                </div>
                <span className="text-muted-foreground">Fuel</span>
              </div>
              <div className="flex items-center gap-1 lg:gap-1.5">
                <div className="w-3 h-3 lg:w-4 lg:h-4 rounded-full bg-purple-500 flex items-center justify-center">
                  <BedDouble className="w-2 h-2 lg:w-2.5 lg:h-2.5 text-white" />
                </div>
                <span className="text-muted-foreground">Rest</span>
              </div>
              <div className="flex items-center gap-1 lg:gap-1.5">
                <div className="w-3 h-3 lg:w-4 lg:h-4 rounded-full bg-blue-500 flex items-center justify-center">
                  <Building2 className="w-2 h-2 lg:w-2.5 lg:h-2.5 text-white" />
                </div>
                <span className="text-muted-foreground">Location</span>
              </div>
            </div>
          </div>

          {/* Distance Indicator */}
          <div className="absolute top-2 lg:top-4 right-2 lg:right-4 glass-panel px-2 lg:px-3 py-1 lg:py-2 z-20">
            <p className="text-[10px] lg:text-xs text-muted-foreground">
              Estimated Route
            </p>
            <p className="text-sm lg:text-lg font-mono font-semibold text-foreground">
              {total_distance_miles} miles
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
