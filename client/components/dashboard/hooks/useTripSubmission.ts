import { useRouter } from "next/navigation";
import { SubmitHandler } from "react-hook-form";

import { useRoute } from "@/client/contexts";
import { TripValueProps } from "@/client/types";

const API_URL: string = process.env.NEXT_PUBLIC_BASE_ENDPOINT as string;

export function useTripSubmission() {
  const router = useRouter();
  const {
    calculateFuelingMarkers,
    tripInfoRef,
    pickupTimeRef,
    setLogData,
    setErrorData,
    setTab,
  } = useRoute();

  const onSubmit: SubmitHandler<TripValueProps> = async (data) => {
    await calculateFuelingMarkers();
    await new Promise((resolve) => setTimeout(resolve, 500));

    const payload = {
      current_cycle_hour: data.current_cycle_hours,
      total_driving_time: tripInfoRef.current.totalTimeMinutes,
      pickup_time: pickupTimeRef.current,
      total_distance_miles: tripInfoRef.current.totalDistanceMiles,
    };

    const res = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });

    const json = await res.json();

    if (!res.ok) {
      setErrorData(json);
      router.push("/error-response");
      return;
    }

    setLogData(json);
    setTab("MapAndLog");
  };

  return { onSubmit };
}
