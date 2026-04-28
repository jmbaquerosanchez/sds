import { useMutation } from "@tanstack/react-query";
import { API_BASE_URL } from "app/core/constants/endpoints";
import type { NewsletterListEntry } from "app/core/services/types/newsletterList";

export type NewsletterSignupPayload = Pick<NewsletterListEntry, "email"> & {
  registeredTimestamp: string;
};

export type NewsletterSignupResponse =
  | NewsletterListEntry
  | NewsletterSignupPayload;

async function submitNewsletterSignup(
  payload: NewsletterSignupPayload,
): Promise<NewsletterSignupResponse> {
  const response = await fetch(`${API_BASE_URL}/newsletterList`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to subscribe to the newsletter");
  }

  const responseBody = await response.text();
  return responseBody
    ? (JSON.parse(responseBody) as NewsletterSignupResponse)
    : payload;
}

export function useNewsletterSignup() {
  return useMutation({
    mutationKey: ["newsletter", "submit"],
    mutationFn: submitNewsletterSignup,
  });
}
