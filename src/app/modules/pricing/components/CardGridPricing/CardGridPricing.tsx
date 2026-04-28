import { usePlans } from "app/core/services/pricingService";
import {
  PRICING_INTERVALS,
  type PricingInterval,
  type PricingPlan,
} from "app/core/services/types/pricing";
import { CardGrid, PricingCard, PricingCardSkeleton } from "compositions";
import { Flex, FlexItem } from "layout";
import { Navigation, NavigationPill, Text } from "primitives";
import { useCallback, useMemo, useState } from "react";

const INTERVAL_LABELS: Record<PricingInterval, string> = {
  month: "Monthly",
  year: "Yearly",
};

export function CardGridPricing() {
  const [activeInterval, setActiveInterval] =
    useState<PricingInterval>("month");
  const { data: plans = [], isLoading, isError } = usePlans(activeInterval);

  const intervalOptions = useMemo(
    () =>
      PRICING_INTERVALS.map((interval) => ({
        value: interval,
        label: INTERVAL_LABELS[interval],
      })),
    [],
  );

  const handleIntervalChange = useCallback((interval: PricingInterval) => {
    setActiveInterval(interval);
  }, []);

  const handlePlanAction = useCallback((plan: PricingPlan) => {
    console.info("[pricing] Plan selected", plan);
  }, []);

  const priceLabel = activeInterval === "month" ? "/ mo" : "/ yr";

  const renderPricingCards = () => {
    if (isLoading) {
      return (
        <Flex
          container
          data-testid="card-grid-pricing-loading"
          gap="1200"
          type="third"
          wrap
        >
          {[0, 1, 2].map((index) => (
            <FlexItem key={`pricing-card-skeleton-${index}`} size="full">
              <PricingCardSkeleton size="large" />
            </FlexItem>
          ))}
        </Flex>
      );
    }

    if (!plans.length) {
      return (
        <Text data-testid="card-grid-pricing-empty">
          No plans available for this interval.
        </Text>
      );
    }

    return (
      <Flex
        container
        data-testid="card-grid-pricing"
        gap="1200"
        type="third"
        wrap
      >
        {plans.map((plan) => (
          <FlexItem key={plan.id} size="minor">
            <PricingCard
              data-testid={`plan-card-${plan.id}`}
              heading={plan.name}
              action="Select plan"
              actionVariant={plan.popular ? "neutral" : "primary"}
              variant={plan.popular ? "brand" : "stroke"}
              interval={plan.interval}
              sku={plan.sku}
              price={plan.price.toString()}
              priceCurrency={plan.currency}
              priceLabel={priceLabel}
              list={plan.features}
              onAction={() => handlePlanAction(plan)}
            />
          </FlexItem>
        ))}
      </Flex>
    );
  };

  return (
    <CardGrid>
      <Navigation aria-label="Pricing interval" direction="row">
        {intervalOptions.map(({ value, label }) => (
          <NavigationPill
            key={value}
            isSelected={activeInterval === value}
            onPress={() => handleIntervalChange(value)}
            data-testid={`pricing-interval-pill-${value}`}
          >
            {label}
          </NavigationPill>
        ))}
      </Navigation>
      {isError ? (
        <Text role="alert" data-testid="card-grid-pricing-error">
          We could not load our pricing plans. Refresh to try again.
        </Text>
      ) : (
        renderPricingCards()
      )}
    </CardGrid>
  );
}
