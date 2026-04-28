import { useMutation } from "@tanstack/react-query";
import { API_BASE_URL } from "app/core/constants/endpoints";
import type { Contact } from "./types/contact";

export type ContactPayload = Omit<Contact, "id">;
export type ContactResponse = Contact | ContactPayload;

async function submitContact(payload: ContactPayload): Promise<ContactResponse> {
  const response = await fetch(`${API_BASE_URL}/contacts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to submit contact information");
  }

  const responseBody = await response.text();
  return responseBody ? (JSON.parse(responseBody) as ContactResponse) : payload;
}

export function useSubmitContact() {
  return useMutation({
    mutationKey: ["contacts", "submit"],
    mutationFn: submitContact,
  });
}
