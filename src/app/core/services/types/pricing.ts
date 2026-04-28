/**
 * Pricing plan types
 */
export const PRICING_INTERVALS = ["month", "year"] as const;
export type PricingInterval = (typeof PRICING_INTERVALS)[number];

export type PricingPlan = {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: PricingInterval;
  features: string[];
  popular?: boolean;
  sku: string;
};
