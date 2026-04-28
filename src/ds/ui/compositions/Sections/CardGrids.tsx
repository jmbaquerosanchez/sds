import { Flex, Section, type FlexProps, type SectionProps } from "layout";

export type CardGridProps = SectionProps & { flexProps?: FlexProps };
export function CardGrid({
  children,
  flexProps,
  ...sectionProps
}: CardGridProps) {
  return (
    <Section padding="1600" {...sectionProps}>
      <Flex
        container
        alignPrimary="center"
        alignSecondary="center"
        direction="column"
        gap="1200"
        {...flexProps}
      >
        {children}
      </Flex>
    </Section>
  );
}
