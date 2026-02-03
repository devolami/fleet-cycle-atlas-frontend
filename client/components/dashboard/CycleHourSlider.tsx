import { Clock } from "lucide-react";

import { Slider } from "@/ui/slider";

import { Label } from "../ui/label";
import { cn } from "../lib/utils";

type InputSidebarProps = {
  isMobile?: boolean;
  cycleHours: number[];
  setCycleHours: React.Dispatch<React.SetStateAction<number[]>>;
};

export function CycleHourSlider({
  isMobile,
  cycleHours,
  setCycleHours,
}: InputSidebarProps) {
  return (
    <div
      className={cn(
        "space-y-2 lg:space-y-4",
        isMobile && "sm:col-span-2 md:col-span-4",
      )}
    >
      <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        <Clock className="w-4 h-4" />
        Current Cycle Hours Used
      </Label>
      <div className="bg-secondary/30 rounded-lg p-3 lg:p-4 space-y-2 lg:space-y-4">
        <Slider
          min={0}
          max={70}
          step={1}
          value={cycleHours}
          onValueChange={setCycleHours}
          className="w-full"
        />
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground text-xs">0 hrs</span>
          <span className="font-mono text-base lg:text-xl font-semibold text-primary">
            {cycleHours[0]} hrs
          </span>
          <span className="text-muted-foreground text-xs">70 hrs</span>
        </div>
        <div className="text-xs text-muted-foreground text-center">
          {70 - cycleHours[0]} hours remaining in cycle
        </div>
      </div>
    </div>
  );
}
