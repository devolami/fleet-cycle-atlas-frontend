"use client";

import React, { useState, useEffect, useRef, RefObject } from "react";
import Map, {
  Marker,
  FullscreenControl,
  GeolocateControl,
  NavigationControl,
  Source,
  Layer,
  MapRef,
  LayerProps,
} from "react-map-gl/mapbox";

import { Fuel, MapPin, Building2, BedDouble, Navigation } from "lucide-react";

import { useRoute } from "../contexts";
import { LngLatBounds } from "mapbox-gl"; // Import LngLatBounds

const ACCESS_TOKEN: string = process.env.NEXT_PUBLIC_ACCESS_TOKEN as string;

// Custom marker component matching the design system
interface CustomMarkerProps {
  type: "origin" | "destination" | "pickup" | "fuel" | "rest" | "current";
  label?: string;
}

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

function CustomMarker({ type, label }: CustomMarkerProps) {
  const Icon = markerIcons[type];

  return (
    <div className="relative group cursor-pointer">
      <div
        className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-110 ${markerStyles[type]}`}
      >
        <Icon className="w-4 h-4 lg:w-5 lg:h-5" />
      </div>
      {/* Pulse ring for origin/destination */}
      {(type === "origin" || type === "destination" || type === "current") && (
        <div
          className={`absolute inset-0 rounded-full animate-ping opacity-30 ${
            type === "origin" || type === "current"
              ? "bg-primary"
              : "bg-success"
          }`}
          style={{ animationDuration: "2s" }}
        />
      )}
      {/* Tooltip */}
      {label && (
        <div className="absolute left-1/2 -translate-x-1/2 -top-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
          <div className="bg-secondary text-popover-foreground text-xs px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl border border-border/50 backdrop-blur-sm">
            {label}
          </div>
        </div>
      )}
    </div>
  );
}

function CustomFuelMarker({ type, label }: CustomMarkerProps) {
  const Icon = markerIcons[type];

  return (
    <div className="relative group cursor-pointer">
      <div
        className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-110 ${markerStyles[type]}`}
      >
        <Icon className="w-4 h-4 lg:w-5 lg:h-5" />
      </div>
      {/* Tooltip */}
      {label && (
        <div className="absolute left-1/2 -translate-x-1/2 -top-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
          <div className="bg-secondary text-popover-foreground text-xs px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl border border-border/50 backdrop-blur-sm">
            {label}
          </div>
        </div>
      )}
    </div>
  );
}

function TripMap() {
  const {
    routeCoordinates,
    coords,
    calculateFuelingMarkers,
    fuelingMarkersRef,
  } = useRoute();

  const [viewState, setViewState] = useState({
    longitude: routeCoordinates[0].longitude,
    latitude: routeCoordinates[0].latitude,
    zoom: 7,
  });
  const mapRef: RefObject<MapRef | null> = useRef(null);
  const fuelingMarkers = fuelingMarkersRef.current;

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

  // Route line style matching the design system
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

  useEffect(() => {
    const fetchRoutes = async () => {
      await calculateFuelingMarkers();
    };
    if (routeCoordinates.length > 0 && mapRef.current) {
      const bounds = new LngLatBounds();
      routeCoordinates.forEach((coord) => {
        bounds.extend([coord.longitude, coord.latitude]);
      });
      mapRef.current.getMap().fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 }, // Add padding around the bounds
        duration: 1000, // Disable animation
      });
    }
    fetchRoutes();
  }, [routeCoordinates]);

  // Get marker type based on index
  const getMarkerType = (
    index: number,
    total: number,
  ): CustomMarkerProps["type"] => {
    if (index === 0) return "origin";
    if (index === total - 1) return "destination";
    return "pickup";
  };

  // Get marker label based on index
  const getMarkerLabel = (index: number, total: number): string => {
    if (index === 0) return "Current Location";
    if (index === total - 1) return "Drop-off";
    return `Pickup`;
  };

  return (
    <div className="glass-panel h-75 sm:h-87.5 lg:h-112.5 overflow-hidden">
      {/* Map Container */}
      <Map
        initialViewState={viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={ACCESS_TOKEN}
        style={{ height: "100vh", width: "100vw", position: "relative" }}
        ref={mapRef}
        attributionControl={false}
      >
        {/* Route Source with Glow and Line layers */}
        <Source id="routeSource" type="geojson" data={geojson}>
          <Layer {...routeGlowStyle} />
          <Layer {...routeLineStyle} />
        </Source>

        {/* Route coordinate markers */}
        {routeCoordinates.map((route, index) => (
          <Marker
            key={`route-${index}`}
            longitude={route.longitude}
            latitude={route.latitude}
            anchor="center"
          >
            <CustomMarker
              type={getMarkerType(index, routeCoordinates.length)}
              label={getMarkerLabel(index, routeCoordinates.length)}
            />
          </Marker>
        ))}

        {/* Fueling markers */}
        {fuelingMarkers.map((marker, index) => (
          <Marker
            key={`fueling-${index}`}
            longitude={marker.longitude}
            latitude={marker.latitude}
            anchor="center"
          >
            <CustomFuelMarker type="fuel" label={`Fuel Stop ${index + 1}`} />
          </Marker>
        ))}

        {/* Map Controls with custom styling */}
        <div className="[&_.mapboxgl-ctrl-group]:bg-secondary/80 [&_.mapboxgl-ctrl-group]:backdrop-blur-sm [&_.mapboxgl-ctrl-group]:border-border/50 [&_.mapboxgl-ctrl-group]:shadow-lg [&_.mapboxgl-ctrl-group_button]:text-foreground [&_.mapboxgl-ctrl-group_button:hover]:bg-accent">
          <GeolocateControl position="top-right" />
          <FullscreenControl position="top-right" />
          <NavigationControl position="top-right" showCompass showZoom />
        </div>
      </Map>

      {/* Legend Panel */}
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

      {/* Distance Indicator Panel */}
      <div className="absolute top-3 lg:top-4 right-3 lg:right-4 glass-panel px-3 lg:px-4 py-2 lg:py-2.5 z-20">
        <p className="text-[10px] lg:text-xs text-muted-foreground">
          Live Route
        </p>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <p className="text-sm lg:text-base font-mono font-semibold text-foreground">
            Active
          </p>
        </div>
      </div>
    </div>
  );
}

export default TripMap;
