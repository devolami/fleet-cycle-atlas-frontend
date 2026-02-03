import { LucideIcon } from "lucide-react";
import {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  RegisterOptions,
} from "react-hook-form";

export type InputData = {
  current_location: string;
  pickup_location: string;
  drop_off_location: string;
  current_cycle_hours: number;
};

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type LogEntry = {
  hour: number;
  row: "off-duty" | "sleeper" | "driving" | "on-duty";
  action?: string;
};

export type Logbook = {
  logbook: LogEntry[];
  currentHour: number;
  totalTimeTraveled: number;
  timeSpentInOffDuty: number;
  timeSpentInOnDuty: number;
  timeSpentInDriving: number;
  timeSpentInSleeperBerth: number;
};

export type InputConfigProps = {
  name: keyof TripValueProps;
  placeholder: string;
  id: string;
  icon: React.ComponentType<any>;
  label: string;
  validationRules: RegisterOptions<TripValueProps>;
};
export type InputFieldProps = {
  config: InputConfigProps[];
  register: UseFormRegister<TripValueProps>;
  errors: FieldErrors<TripValueProps>;
  setValue: UseFormSetValue<TripValueProps>;
};
export type TripValueProps = {
  current_location: string;
  pickup_location: string;
  drop_off_location: string;
  current_cycle_hours: number;
};

export type MapMarker = {
  type: "fuel" | "rest" | "pickup" | "dropoff" | "current";
  label: string;
  position: { top: string; left: string };
};

export type StatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  subValue?: string;
  badge?: {
    text: string;
    variant: "success" | "warning";
  };
};

export type CustomMarkerProps = {
  type: "origin" | "destination" | "pickup" | "fuel" | "rest" | "current";
  label?: string;
};
