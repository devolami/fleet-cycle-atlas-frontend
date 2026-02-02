"use client";
import React from "react";
import { TripMap } from "../map";
import { LogBook } from "../log";

import { TripForm } from "../form";
import { useRoute } from "../contexts";

export default function Home() {
  const { tab } = useRoute();

  return (
    <div>
      {tab === "MapAndLog" && <MapLog />}
      {tab === "form" && <TripForm />}
    </div>
  );
}

export function MapLog() {
  const { tab } = useRoute();
  return (
    <React.Fragment>
      <div className="flex flex-col justify-center items-center">
        {tab === "MapAndLog" && <TripMap />}
      </div>
      <LogBook />
    </React.Fragment>
  );
}
