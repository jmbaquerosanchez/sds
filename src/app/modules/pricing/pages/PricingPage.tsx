import { CardGridPricing } from "app/modules/pricing/components/CardGridPricing/CardGridPricing";
import { PageAccordion } from "app/modules/pricing/components/PageAccordion/PageAccordion";
import { Hero } from "compositions";
import { TextContentTitle } from "primitives";

export default function PricingPage() {
  return (
    <>
      <Hero variant="subtle">
        <TextContentTitle
          align="center"
          title="Flexible plans for every product team"
          subtitle="Choose a plan, switch intervals anytime, and scale without surprises."
        />
      </Hero>
      <CardGridPricing />
      <PageAccordion />
    </>
  );
}
