import { Flex, Section, type FlexProps, type SectionProps } from "layout";

export type HeroProps = SectionProps & { flexProps?: FlexProps };
export function Hero({ children, flexProps, ...sectionProps }: HeroProps) {
  return (
    <Section
      paddingBottom="4000"
      paddingTop="4000"
      padding="600"
      {...sectionProps}
    >
      <Flex
        container
        alignPrimary="center"
        alignSecondary="center"
        direction="column"
        gap="800"
        {...flexProps}
      >
        {children}
      </Flex>
    </Section>
  );
}
