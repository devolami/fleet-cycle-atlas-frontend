"use client";

import React from "react";

import { TripMap } from "../../map";
import { LogBook } from "../../log";

import { useRoute } from "../../contexts";

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
