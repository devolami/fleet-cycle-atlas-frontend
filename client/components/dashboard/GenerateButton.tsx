import { Zap } from "lucide-react";

import { Button } from "@/ui/button";
import { cn } from "@/lib/utils";

type GenerateButtonProps = {
  isMobile?: boolean;
  isSubmitting: boolean;
};
export function GenerateButton({
  isMobile,
  isSubmitting,
}: GenerateButtonProps) {
  return (
    <div className={cn(isMobile && "sm:col-span-2 md:col-span-4")}>
      <Button
        variant="simulate"
        size={isMobile ? "default" : "lg"}
        className="w-full"
        isLoading={isSubmitting}
      >
        {!isSubmitting && <Zap className="w-5 h-5" />}
        Generate Simulation
      </Button>
    </div>
  );
}
