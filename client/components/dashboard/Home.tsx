"use client";

import { useState } from "react";
import { Clock, Map, ShieldCheck, Fuel } from "lucide-react";

import { useRoute } from "@/client/contexts";

import { InputSidebar } from "./InputSideBar";
import { StatCard } from "./StatCard";
import { MapPlaceholder } from "./MapPlaceholder";

const Home = () => {
  const { tripInfoRef, logData, tripRouteInfo } = useRoute();
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(true);
  const total_distance_miles = Number(
    (tripInfoRef.current?.totalDistanceMiles || 12.47).toFixed(2),
  );
  const numberOfDays = logData ? logData.length : 1;
  const calculatedStops = total_distance_miles / 980;
  const fuelStops = calculatedStops >= 1 ? Math.floor(calculatedStops) : 0;
  function getFullDate(): string {
    const now = new Date();

    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    return now.toLocaleDateString("en-US", options);
  }

  const statCards = (
    <div className="grid grid-cols-2 gap-3 lg:gap-4">
      <StatCard
        icon={Clock}
        label="Total Trip Duration"
        value={`${numberOfDays} ${numberOfDays === 1 ? "day" : "days"}`}
      />
      <StatCard
        icon={Map}
        label="Total Distance"
        value={`${total_distance_miles} mi`}
      />
      <StatCard
        icon={ShieldCheck}
        label="HOS Compliance"
        value="100%"
        badge={{ text: "Compliant", variant: "success" }}
      />
      <StatCard
        icon={Fuel}
        label={
          fuelStops === 0
            ? "No Fuel Stops"
            : fuelStops === 1
              ? "Fuel Stop"
              : "Fuel Stops"
        }
        value={`${fuelStops} `}
      />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col lg:flex-row w-full bg-background">
      {/* Desktop Sidebar - Only visible on lg+ */}
      <div className="hidden lg:block">
        <InputSidebar isMobile={false} />
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-6 overflow-y-auto scrollbar-thin">
        <div className="max-w-6xl mx-auto space-y-4 lg:space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-xl lg:text-2xl font-semibold text-foreground">
                Trip Simulation
              </h1>
              <p className="text-xs lg:text-sm text-muted-foreground">
                {tripRouteInfo.current_location} →{" "}
                {tripRouteInfo.drop_off_location} • {total_distance_miles} miles
              </p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs text-muted-foreground">Last Updated</p>
              <p className="text-xs lg:text-sm font-mono text-foreground">
                {getFullDate()}
              </p>
            </div>
          </div>

          {/* Mobile/Tablet Layout: Form + Stats together (below lg) */}
          <div className="lg:hidden space-y-4">
            {/* Form Section */}
            <InputSidebar isMobile />

            {/* Stats Cards */}
            {statCards}
          </div>

          {/* Desktop Stats Cards (lg+) */}
          <div className="hidden lg:block">{statCards}</div>

          {/* Map Section */}
          {showResults && (
            <div className="space-y-2">
              <h2 className="text-xs lg:text-sm font-medium text-muted-foreground">
                Route Overview
              </h2>
              <MapPlaceholder />
            </div>
          )}

          {isLoading && (
            <div className="glass-panel p-8 lg:p-12 flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
              <p className="text-sm lg:text-base text-muted-foreground text-center">
                Calculating optimal route and HOS schedule...
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
