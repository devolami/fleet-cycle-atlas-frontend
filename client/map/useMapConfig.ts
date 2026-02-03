import { BedDouble, Building2, Fuel, MapPin, Navigation } from "lucide-react";
import type { LayerProps } from "react-map-gl/mapbox";

import { useRoute } from "../contexts";
import type { CustomMarkerProps } from "../types";

export const useMapConfig = () => {
  const { coords } = useRoute();
  const geojson: GeoJSON.FeatureCollection<GeoJSON.LineString> = {
    type: "FeatureCollection",
    features:
      coords?.length > 0
        ? [
            // Only add the feature if we have coords
            {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: coords,
              },
              properties: {},
            },
          ]
        : [],
  };

  const markerStyles: Record<CustomMarkerProps["type"], string> = {
    origin:
      "bg-secondary text-[hsl(160,100%,50%)] shadow-[0_0_12px_hsl(160,100%,40%,0.6)]",
    destination:
      "bg-secondary text-[hsl(350,85%,60%)] shadow-[0_0_12px_hsl(350,85%,55%,0.6)]",
    pickup:
      "bg-secondary text-[hsl(220,90%,60%)] shadow-[0_0_12px_hsl(220,90%,55%,0.6)]",
    fuel: "bg-secondary text-[hsl(25,95%,55%)] shadow-[0_0_12px_hsl(25,95%,50%,0.6)]",
    rest: "bg-secondary text-[hsl(270,75%,60%)] shadow-[0_0_12px_hsl(270,75%,55%,0.6)]",
    current:
      "bg-secondary text-[hsl(160,100%,50%)] animate-pulse shadow-[0_0_16px_hsl(160,100%,40%,0.7)]",
  };

  const markerIcons: Record<CustomMarkerProps["type"], React.ElementType> = {
    origin: MapPin,
    destination: Building2,
    pickup: Building2,
    fuel: Fuel,
    rest: BedDouble,
    current: Navigation,
  };

  const routeLineStyle: LayerProps = {
    id: "trip-route-line",
    type: "line",
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": "#10b981", // primary emerald color
      "line-width": 4,
      "line-opacity": 0.9,
    },
  };

  // Glow effect layer under the main route
  const routeGlowStyle: LayerProps = {
    id: "trip-route-glow",
    type: "line",
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": "#10b981",
      "line-width": 12,
      "line-opacity": 0.2,
      "line-blur": 8,
    },
  };
  const getMarkerType = (
    index: number,
    total: number,
  ): CustomMarkerProps["type"] => {
    if (index === 0) return "origin";
    if (index === total - 1) return "destination";
    return "pickup";
  };
  const getMarkerLabel = (index: number, total: number): string => {
    if (index === 0) return "Current Location";
    if (index === total - 1) return "Drop-off";
    return `Pickup`;
  };
  return {
    geojson,
    markerStyles,
    markerIcons,
    routeLineStyle,
    routeGlowStyle,
    getMarkerType,
    getMarkerLabel,
  };
};
