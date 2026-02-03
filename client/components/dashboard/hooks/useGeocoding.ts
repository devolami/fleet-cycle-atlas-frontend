import { useState } from "react";

import mapboxSdk from "@mapbox/mapbox-sdk";
import geocoding from "@mapbox/mapbox-sdk/services/geocoding";
import { GeocodeFeature } from "@mapbox/mapbox-sdk/services/geocoding";
import { UseFormSetValue } from "react-hook-form";

import { useRoute } from "@/client/contexts";
import { Coordinates, TripValueProps } from "@/client/types";

const ACCESS_TOKEN: string = process.env.NEXT_PUBLIC_ACCESS_TOKEN! as string;

const mapboxClient = mapboxSdk({ accessToken: ACCESS_TOKEN });
const geocodingClient = geocoding(mapboxClient);

type UseGeocodingParams = {
  setValue: UseFormSetValue<TripValueProps>;
};

export function useGeocoding({ setValue }: UseGeocodingParams) {
  const { setTripRouteInfo, setRouteCoordinates } = useRoute();
  const [suggestions, setSuggestions] = useState<GeocodeFeature[]>([]);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const onChange =
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

  const onSelect = (
    name: keyof TripValueProps,
    index: number,
    suggestion: GeocodeFeature,
  ) => {
    setValue(name, suggestion.place_name, {
      shouldValidate: true,
    });
    setTripRouteInfo((prev) => ({
      ...prev,
      [name]: suggestion.place_name,
    }));

    const field_coordinates: Coordinates = {
      longitude: suggestion.center[0],
      latitude: suggestion.center[1],
    };

    setRouteCoordinates((prevCoordinates) => {
      const newCoordinates = [...prevCoordinates];
      newCoordinates[index] = field_coordinates;
      return newCoordinates;
    });

    setSuggestions([]);
  };

  return { suggestions, onChange, onSelect, focusedField };
}
