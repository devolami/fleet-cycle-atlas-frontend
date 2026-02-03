import { Fuel, MapPin, Building2 } from "lucide-react";
export function LegendPanel() {
  return (
    <div className="absolute bottom-3 lg:bottom-4 left-10 lg:left-50 glass-panel p-2.5 lg:p-3 space-y-1.5 lg:space-y-2 z-20">
      <p className="text-[10px] lg:text-xs font-medium text-white mb-1.5 lg:mb-2">
        Route Legend
      </p>
      <div className="flex flex-wrap gap-2.5 lg:gap-3 text-[10px] lg:text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 lg:w-4 lg:h-4 rounded-full bg-[hsl(160,100%,40%)] flex items-center justify-center">
            <MapPin className="w-2 h-2 lg:w-2.5 lg:h-2.5 text-white" />
          </div>
          <span className="text-white">Current location</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 lg:w-4 lg:h-4 rounded-full bg-[hsl(350,85%,55%)] flex items-center justify-center">
            <Building2 className="w-2 h-2 lg:w-2.5 lg:h-2.5 text-white" />
          </div>
          <span className="text-white">Drop-off</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 lg:w-4 lg:h-4 rounded-full bg-[hsl(25,95%,50%)] flex items-center justify-center">
            <Fuel className="w-2 h-2 lg:w-2.5 lg:h-2.5 text-white" />
          </div>
          <span className="text-white">Fuel</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 lg:w-4 lg:h-4 rounded-full bg-[hsl(220,90%,55%)] flex items-center justify-center">
            <Building2 className="w-2 h-2 lg:w-2.5 lg:h-2.5 text-white" />
          </div>
          <span className="text-white">Pickup</span>
        </div>
      </div>
    </div>
  );
}
