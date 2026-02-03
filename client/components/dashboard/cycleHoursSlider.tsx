import { Controller, UseFormReturn } from "react-hook-form";
import { Clock } from "lucide-react";

import { Label } from "@/ui/label";
import { Slider } from "@/ui/slider";
import { cn } from "@/lib/utils";

import { TripValueProps } from "@/client/types";

interface CycleHoursSliderProps {
  form: UseFormReturn<TripValueProps>;
  isMobile?: boolean;
}

export function CycleHoursSlider({
  form,
  isMobile = false,
}: CycleHoursSliderProps) {
  const { control } = form;

  return (
    <div
      className={cn(
        "space-y-2 lg:space-y-4",
        isMobile && "sm:col-span-2 md:col-span-4",
      )}
    >
      <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Clock className="w-4 h-4" />
        Current Cycle Hours Used
      </Label>

      <div className="bg-secondary/30 rounded-lg p-3 lg:p-4 space-y-2 lg:space-y-4">
        <Controller
          name="current_cycle_hours"
          control={control}
          render={({ field }) => (
            <>
              <Slider
                min={0}
                max={70}
                step={1}
                value={[field.value]}
                onValueChange={(val) => field.onChange(val[0])}
              />

              <div className="flex justify-between text-sm">
                <span className="text-xs text-muted-foreground">0 hrs</span>

                <span className="font-mono text-lg font-semibold text-primary">
                  {field.value} hrs
                </span>

                <span className="text-xs text-muted-foreground">70 hrs</span>
              </div>

              <div className="text-xs text-muted-foreground text-center">
                {70 - field.value} hours remaining in cycle
              </div>
            </>
          )}
        />
      </div>
    </div>
  );
}
