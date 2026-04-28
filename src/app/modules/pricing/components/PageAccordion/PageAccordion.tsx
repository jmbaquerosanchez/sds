import { useFaqs } from "app/core/services/pricingService";
import { Flex, FlexItem, Section } from "layout";
import { Accordion, AccordionItem, Text, TextContentHeading } from "primitives";

export function PageAccordion() {
  const { data: faqs = [], isLoading, isError } = useFaqs();

  const renderContent = () => {
    if (isLoading) {
      return (
        <Text data-testid="page-accordion-loading">
          Loading frequently asked questions…
        </Text>
      );
    }

    if (isError) {
      return (
        <Text role="alert" data-testid="page-accordion-error">
          We could not load FAQs right now. Please try again later.
        </Text>
      );
    }

    if (!faqs.length) {
      return (
        <Text data-testid="page-accordion-empty">
          We will add answers shortly.
        </Text>
      );
    }

    return (
      <Accordion data-testid="page-accordion-list">
        {faqs.map((faq, index) => (
          <AccordionItem key={`${faq.question}-${index}`} title={faq.question}>
            <Text>{faq.answer}</Text>
          </AccordionItem>
        ))}
      </Accordion>
    );
  };

  return (
    <Section padding="1600">
      <Flex container direction="column" alignSecondary="stretch" gap="1200">
        <TextContentHeading
          align="center"
          heading="Common questions"
          subheading="Everything you need to know about pricing"
        />
        <FlexItem size="full">{renderContent()}</FlexItem>
      </Flex>
    </Section>
  );
}
