import { useMutation } from "@tanstack/react-query";
import { API_BASE_URL } from "app/core/constants/endpoints";
import type { WaitingListEntry } from "./types/waitingList";

export type WaitingListPayload = Pick<WaitingListEntry, "email">;
export type WaitingListResponse = WaitingListEntry | WaitingListPayload;

async function submitWaitingList(
  payload: WaitingListPayload,
): Promise<WaitingListResponse> {
  const response = await fetch(`${API_BASE_URL}/waiting`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to join the waiting list");
  }

  const responseBody = await response.text();
  return responseBody ? (JSON.parse(responseBody) as WaitingListResponse) : payload;
}

export function useSubmitWaitingList() {
  return useMutation({
    mutationKey: ["waiting", "submit"],
    mutationFn: submitWaitingList,
  });
}
