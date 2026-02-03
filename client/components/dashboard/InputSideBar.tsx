import { useState } from "react";

import { useTripSubmission } from "./hooks/useTripSubmission";

import { InputField } from "./form/InputField";
import { formConfig } from "./form/config";
import { CycleHourSlider } from "./CycleHourSlider";

import SideBarHeader from "./SideBarHeader";
import SideBarFooter from "./SideBarFooter";

import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { TripValueProps } from "@/client/types";
import { GenerateButton } from "./GenerateButton";

interface InputSidebarProps {
  isMobile?: boolean;
}

export function InputSidebar({ isMobile = false }: InputSidebarProps) {
  const [cycleHours, setCycleHours] = useState([32]);

  const form = useForm<TripValueProps>({
    mode: "onChange",
    defaultValues: {
      current_cycle_hours: cycleHours[0],
      current_location: "Chicago, IL",
      drop_off_location: "Atlanta, GA",
      pickup_location: "Indianapolis, IN",
    },
  });
  const { register, handleSubmit, formState, setValue, getValues } = form;
  const { errors, isSubmitting } = formState;
  const { onSubmit } = useTripSubmission();
  return (
    <aside
      className={cn(
        "flex flex-col gap-4 lg:gap-6 overflow-y-auto scrollbar-thin",
        isMobile ? "glass-panel p-4 rounded-xl" : "w-80 glass-panel p-6 h-full",
      )}
    >
      {/* Header */}
      <SideBarHeader />
      <div className="h-px bg-border/50" />

      {/* Input Fields */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={cn(
          "flex-1",
          isMobile
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3"
            : "space-y-5",
        )}
      >
        <InputField
          config={formConfig(getValues)}
          register={register}
          errors={errors}
          setValue={setValue}
        />
        {/* Cycle Hours Slider */}
        <CycleHourSlider
          isMobile={isMobile}
          cycleHours={cycleHours}
          setCycleHours={setCycleHours}
        />
        {/* Generate Button */}
        <GenerateButton isMobile={isMobile} isSubmitting={isSubmitting} />
      </form>
      {/* Footer Info - hide on mobile */}
      {!isMobile && <SideBarFooter />}
    </aside>
  );
}
