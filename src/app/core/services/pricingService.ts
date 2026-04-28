import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "app/core/constants/endpoints";
import type { FAQItem } from "app/core/services/types/faq";
import type {
  PricingInterval,
  PricingPlan,
} from "app/core/services/types/pricing";

const PLANS_ENDPOINT = `${API_BASE_URL}/plans`;
const FAQS_ENDPOINT = `${API_BASE_URL}/faqs`;

function createPlansUrl(interval?: PricingInterval) {
  const url = new URL(PLANS_ENDPOINT);
  if (interval) {
    url.searchParams.set("interval", interval);
  }
  return url.toString();
}

async function fetchPlans(interval?: PricingInterval): Promise<PricingPlan[]> {
  const response = await fetch(createPlansUrl(interval));

  if (!response.ok) {
    throw new Error("Failed to fetch pricing plans");
  }

  return (await response.json()) as PricingPlan[];
}

async function fetchFaqs(): Promise<FAQItem[]> {
  const response = await fetch(FAQS_ENDPOINT);

  if (!response.ok) {
    throw new Error("Failed to fetch FAQs");
  }

  return (await response.json()) as FAQItem[];
}

export function usePlans(interval: PricingInterval) {
  return useQuery({
    queryKey: ["plans", interval],
    queryFn: () => fetchPlans(interval),
  });
}

export function useFaqs() {
  return useQuery({
    queryKey: ["faqs"],
    queryFn: fetchFaqs,
  });
}
