import { PricingPlan, Product } from "data";
import { Image } from "primitives";
import type {
  PricingCardProps,
  ProductInfoCardProps,
} from "./Cards";

/**
 * Converts a PricingPlan to a PricingCardProps object.
 */
export function pricingPlanToPricingCardProps(
  plan: PricingPlan,
  index: number,
  currentPlan?: PricingPlan,
  setCurrentPlan?: (plan: PricingPlan) => void,
): PricingCardProps {
  const isActive = currentPlan?.id === plan.id;
  const level = parseInt(plan.sku.split("-")[0]);
  const levelCurrent = currentPlan
    ? parseInt(currentPlan?.sku.split("-")[0])
    : null;
  const levelUpgrade = levelCurrent && levelCurrent < level;
  const levelDowngrade = levelCurrent && levelCurrent > level;
  const goAnnual = levelCurrent === level && currentPlan?.interval === "month";
  const goMonthly = levelCurrent === level && currentPlan?.interval === "year";
  const action = isActive
    ? "Current Plan"
    : levelUpgrade
        ? `Upgrade to ${plan.name}`
        : levelDowngrade
          ? `Downgrade to ${plan.name}`
          : goAnnual
            ? `Go Annual`
            : goMonthly
              ? `Go Monthly`
              : `Select ${plan.name}`;
  return {
    sku: plan.sku,
    interval: plan.interval,
    list: plan.features,
    heading: plan.name,
    priceCurrency: plan.currency,
    action,
    actionDisabled: isActive,
    actionVariant: index === 1 ? "neutral" : "primary",
    variant: index === 1 ? "brand" : "stroke",
    price: plan.price.toString(),
    priceLabel: plan.interval === "month" ? "/ mo" : "/ yr",
    onAction: () =>
      setCurrentPlan
        ? setCurrentPlan(plan)
        : console.log(`Selected ${plan.name}`),
  };
}

/**
 * Converts a Product to ProductInfoCardProps object.
 */
export function productToProductInfoCardProps(
  product: Product,
): ProductInfoCardProps {
  return {
    heading: product.name,
    price: product.price.toString(),
    description: product.description,
    rating: product.rating,
    asset: (
      <Image
        src={product.imageUrl}
        alt={product.name}
        aspectRatio="4-3"
        className="product-info-card-asset"
      />
    ),
  };
}
