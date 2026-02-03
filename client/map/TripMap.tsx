"use client";

import { LngLatBounds } from "mapbox-gl";
import React, { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import Map, {
  FullscreenControl,
  GeolocateControl,
  Layer,
  Marker,
  NavigationControl,
  Source,
} from "react-map-gl/mapbox";
import type { MapRef } from "react-map-gl/mapbox";

import { useRoute } from "../contexts";
import { useMapConfig } from "./useMapConfig";

import { CustomFuelMarker, CustomMarker } from "./CustomMarker";
import { LegendPanel } from "./LegendPanel";

const ACCESS_TOKEN: string = process.env.NEXT_PUBLIC_ACCESS_TOKEN as string;

function TripMap() {
  const { routeCoordinates, calculateFuelingMarkers, fuelingMarkersRef } =
    useRoute();
  const {
    geojson,
    routeLineStyle,
    routeGlowStyle,
    getMarkerType,
    getMarkerLabel,
  } = useMapConfig();

  const [viewState, setViewState] = useState({
    longitude: routeCoordinates[0].longitude,
    latitude: routeCoordinates[0].latitude,
    zoom: 7,
  });
  const mapRef: RefObject<MapRef | null> = useRef(null);
  const fuelingMarkers = fuelingMarkersRef.current;

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
      <LegendPanel />
    </div>
  );
}

export default TripMap;
