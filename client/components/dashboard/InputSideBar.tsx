import { useState } from "react";
import { MapPin, Navigation, Building2, Clock, Zap } from "lucide-react";

import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Slider } from "@/ui/slider";
import { cn } from "@/lib/utils";
import { useForm, SubmitHandler } from "react-hook-form";
import mapboxSdk from "@mapbox/mapbox-sdk";
import geocoding from "@mapbox/mapbox-sdk/services/geocoding";
import { GeocodeFeature } from "@mapbox/mapbox-sdk/services/geocoding";
import { useRoute } from "../../contexts";
import { Coordinates } from "../../form/types";
import { useRouter } from "next/navigation";

interface InputSidebarProps {
  isMobile?: boolean;
}

type TripValueProps = {
  current_location: string;
  pickup_location: string;
  drop_off_location: string;
  current_cycle_hours: number;
};

const ACCESS_TOKEN: string = process.env.NEXT_PUBLIC_ACCESS_TOKEN! as string;
const API_URL: string = process.env.NEXT_PUBLIC_BASE_ENDPOINT as string;

const mapboxClient = mapboxSdk({ accessToken: ACCESS_TOKEN });
const geocodingClient = geocoding(mapboxClient);

export function InputSidebar({ isMobile = false }: InputSidebarProps) {
  const [cycleHours, setCycleHours] = useState([32]);
  const { setRouteCoordinates } = useRoute();
  const [suggestions, setSuggestions] = useState<GeocodeFeature[]>([]);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const router = useRouter();

  const {
    tripInfoRef,
    pickupTimeRef,
    setLogData,
    setTab,
    calculateFuelingMarkers,
    setErrorData,
    setTripRouteInfo,
  } = useRoute();

  const form = useForm<TripValueProps>({
    mode: "onChange",
    defaultValues: {
      current_cycle_hours: cycleHours[0],
      current_location: "Chicago, IL",
      drop_off_location: "Atlanta, GA",
      pickup_location: "Indianapolis, IN",
    },
  });
  const { register, handleSubmit, formState, reset, watch, setValue } = form;
  const { errors, isSubmitting } = formState;

  const handleInputChange =
    (name: keyof TripValueProps, index: number) =>
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setValue(name, value, { shouldValidate: true });

      if (value.length > 2) {
        try {
          const response = await geocodingClient
            .forwardGeocode({
              query: value,
              limit: 5,
            })
            .send();

          const results = response.body.features;
          setSuggestions(results);
          setFocusedField(name);

          // If results exist, extract the first suggestion's coordinates
          if (results.length > 0) {
            // Do not extract lat and log from current_cycle_hour field
            const suggestion = results[0]; // Pick the first result
            const field_coordinates: Coordinates = {
              longitude: suggestion.center[0],
              latitude: suggestion.center[1],
            };
            setRouteCoordinates((prevCoordinates) => {
              const newCoordinates = [...prevCoordinates];
              if (index < newCoordinates.length) {
                newCoordinates[index] = field_coordinates;
              } else {
                newCoordinates.push(field_coordinates); // Ensure new entries are added
              }
              return newCoordinates;
            });
          }
        } catch (error) {
          console.error("Geocoding error:", error);
        }
      } else {
        setSuggestions([]);
        setFocusedField(null);
      }
    };

  const generateLogAndMap: SubmitHandler<TripValueProps> = async (data) => {
    try {
      await calculateFuelingMarkers();
      await new Promise((resolve) => setTimeout(resolve, 500));

      const latestTripInfo = tripInfoRef.current;
      const latestPickUpTime = pickupTimeRef.current;

      const requestData = {
        current_cycle_hour: data.current_cycle_hours,
        total_driving_time: latestTripInfo.totalTimeMinutes,
        pickup_time: latestPickUpTime,
        total_distance_miles: latestTripInfo.totalDistanceMiles,
      };
      const response = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(requestData),
        headers: { "Content-Type": "application/json" },
      });

      const responseData = await response.json();

      if (!response.ok) {
        setErrorData(responseData);
        await new Promise((resolve) => setTimeout(resolve, 500));

        router.push("/error-response");
      }
      if (response.ok) {
        setLogData(responseData);

        console.log("Response Data", responseData);
        setTab("MapAndLog");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      reset();
    }
  };
  return (
    <aside
      className={cn(
        "flex flex-col gap-4 lg:gap-6 overflow-y-auto scrollbar-thin",
        isMobile ? "glass-panel p-4 rounded-xl" : "w-80 glass-panel p-6 h-full",
      )}
    >
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Zap className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-base lg:text-lg font-semibold text-foreground">
              ELD Simulator
            </h1>
            <p className="text-xs text-muted-foreground">
              Fleet Management Pro
            </p>
          </div>
        </div>
      </div>
      <div className="h-px bg-border/50" />

      {/* Input Fields */}
      <form
        onSubmit={handleSubmit(generateLogAndMap)}
        className={cn(
          "flex-1",
          isMobile
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3"
            : "space-y-5",
        )}
      >
        {/* Current Location */}
        <div className="space-y-2">
          <Label
            htmlFor="current"
            className="text-sm font-medium text-muted-foreground flex items-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            Current Location
          </Label>
          <Input
            id="current"
            {...register("current_location", {
              required: "Current location is required",
              validate: (value) => {
                return (
                  (value !== watch("pickup_location") &&
                    value !== watch("drop_off_location")) ||
                  "Current location cannot be the same as pickup or drop-off"
                );
              },
            })}
            className="input-glass"
            placeholder="Enter current location"
            onChange={handleInputChange("current_location", 0)}
          />
          {suggestions.length > 0 && focusedField === "current_location" && (
            <div className="w-full h-32 p-5 overflow-x-hidden overflow-y-auto border-solid border-[#F4EBFF] z-10">
              <ul>
                {suggestions.map((suggestion) => (
                  <li
                    onClick={() => {
                      setValue("current_location", suggestion.place_name, {
                        shouldValidate: true,
                      });
                      setTripRouteInfo((prev) => ({
                        ...prev,
                        current: suggestion.place_name,
                      }));

                      const field_coordinates: Coordinates = {
                        longitude: suggestion.center[0],
                        latitude: suggestion.center[1],
                      };

                      setRouteCoordinates((prevCoordinates) => {
                        const newCoordinates = [...prevCoordinates];
                        newCoordinates[0] = field_coordinates;
                        return newCoordinates;
                      });

                      setSuggestions([]);
                    }}
                    key={suggestion.id}
                    className="cursor-pointer m-4 text-yellow-600"
                  >
                    {suggestion.place_name}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {errors.current_location && (
            <p className="text-yellow-500 text-sm">
              {errors.current_location.message}
            </p>
          )}
        </div>

        {/* Pickup Location */}
        <div className="space-y-2">
          <Label
            htmlFor="pickup"
            className="text-sm font-medium text-muted-foreground flex items-center gap-2"
          >
            <Navigation className="w-4 h-4" />
            Pickup Location
          </Label>
          <Input
            id="pickup"
            {...register("pickup_location", {
              required: "Pickup location is required",
              validate: (value) => {
                return (
                  value !== watch("drop_off_location") ||
                  "Pickup cannot be the same as drop-off"
                );
              },
            })}
            className="input-glass"
            placeholder="Enter pickup location"
            onChange={handleInputChange("pickup_location", 1)}
          />
          {suggestions.length > 0 && focusedField === "pickup_location" && (
            <div className="w-full h-32 p-5 overflow-x-hidden overflow-y-auto border-solid border-[#F4EBFF] z-10">
              <ul>
                {suggestions.map((suggestion) => (
                  <li
                    onClick={() => {
                      setValue("pickup_location", suggestion.place_name, {
                        shouldValidate: true,
                      });

                      const field_coordinates: Coordinates = {
                        longitude: suggestion.center[0],
                        latitude: suggestion.center[1],
                      };

                      setRouteCoordinates((prevCoordinates) => {
                        const newCoordinates = [...prevCoordinates];
                        newCoordinates[1] = field_coordinates;
                        return newCoordinates;
                      });

                      setSuggestions([]);
                    }}
                    key={suggestion.id}
                    className="cursor-pointer m-4 text-yellow-600"
                  >
                    {suggestion.place_name}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {errors.pickup_location && (
            <p className="text-yellow-500 text-sm">
              {errors.pickup_location.message}
            </p>
          )}
        </div>

        {/* Drop-off Location */}
        <div className="space-y-2">
          <Label
            htmlFor="dropoff"
            className="text-sm font-medium text-muted-foreground flex items-center gap-2"
          >
            <Building2 className="w-4 h-4" />
            Drop-off Location
          </Label>
          <Input
            id="dropoff"
            {...register("drop_off_location", {
              required: "Drop-off location is required",
              validate: (value) => {
                return (
                  value !== watch("pickup_location") ||
                  "Drop-off cannot be the same as pickup"
                );
              },
            })}
            className="input-glass"
            placeholder="Enter drop-off location"
            onChange={handleInputChange("drop_off_location", 2)}
          />
          {suggestions.length > 0 && focusedField === "drop_off_location" && (
            <div className="w-full h-32 p-5 overflow-x-hidden overflow-y-auto border-solid border-[#F4EBFF] z-10">
              <ul>
                {suggestions.map((suggestion) => (
                  <li
                    onClick={() => {
                      setValue("drop_off_location", suggestion.place_name, {
                        shouldValidate: true,
                      });
                      setTripRouteInfo((prev) => ({
                        ...prev,
                        drop_off: suggestion.place_name,
                      }));

                      const field_coordinates: Coordinates = {
                        longitude: suggestion.center[0],
                        latitude: suggestion.center[1],
                      };

                      setRouteCoordinates((prevCoordinates) => {
                        const newCoordinates = [...prevCoordinates];
                        newCoordinates[2] = field_coordinates;
                        return newCoordinates;
                      });

                      setSuggestions([]);
                    }}
                    key={suggestion.id}
                    className="cursor-pointer m-4 text-yellow-600"
                  >
                    {suggestion.place_name}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {errors.drop_off_location && (
            <p className="text-yellow-500 text-sm">
              {errors.drop_off_location.message}
            </p>
          )}
        </div>

        {/* Cycle Hours Slider */}
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
        {/* Generate Button */}
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
      </form>
      {/* Footer Info - hide on mobile */}
      {!isMobile && (
        <div className="text-xs text-muted-foreground text-center space-y-1">
          <p>FMCSA HOS Compliant</p>
          <p className="text-primary/70">v2.4.1</p>
        </div>
      )}
    </aside>
  );
}
