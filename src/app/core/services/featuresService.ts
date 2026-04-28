import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "../constants/endpoints";
import type { Feature } from "../types/Feature.types";

async function fetchFeatures(): Promise<Feature[]> {
  const response = await fetch(`${API_BASE_URL}/features`);
  if (!response.ok) {
    throw new Error("Failed to fetch features");
  }
  return response.json();
}

export function useFeatures() {
  return useQuery({
    queryKey: ["features"],
    queryFn: fetchFeatures,
  });
}
