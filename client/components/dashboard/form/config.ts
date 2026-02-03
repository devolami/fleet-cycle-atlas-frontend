import { MapPin, Navigation, Building2 } from "lucide-react";
import { UseFormGetValues } from "react-hook-form";

import { TripValueProps, InputConfigProps } from "@/client/types";

export const formConfig = (
  getValues: UseFormGetValues<TripValueProps>,
): InputConfigProps[] => [
  {
    name: "current_location",
    id: "current_location",
    label: "Current Location",
    icon: MapPin,
    placeholder: "Enter current Location",
    validationRules: {
      required: "Current location is required",
      validate: {
        duplicateLocationCheck: (value) => {
          return (
            (value !== getValues("pickup_location") &&
              value !== getValues("drop_off_location")) ||
            "Current location cannot be the same as pickup or drop-off"
          );
        },
      },
    },
  },
  {
    name: "pickup_location",
    id: "pickup_location",
    label: "Pickup Location",
    icon: Navigation,
    placeholder: "Enter pickup location",
    validationRules: {
      required: "Pickup location is required",
      validate: {
        duplicateLocationCheck: (value) => {
          return (
            (value !== getValues("current_location") &&
              value !== getValues("drop_off_location")) ||
            "Pickup location cannot be the same as current or drop-off"
          );
        },
      },
    },
  },
  {
    name: "drop_off_location",
    id: "drop_off_location",
    label: "Drop Off Location",
    icon: Building2,
    placeholder: "Enter drop off location",
    validationRules: {
      required: "Drop off location is required",
      validate: {
        duplicateLocationCheck: (value) => {
          return (
            (value !== getValues("current_location") &&
              value !== getValues("pickup_location")) ||
            "Drop off location cannot be the same as current or pickup"
          );
        },
      },
    },
  },
];
