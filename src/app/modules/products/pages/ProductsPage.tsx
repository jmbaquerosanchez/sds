import { FilterBar } from "app/modules/products/components/FilterBar/FilterBar";
import { FilterMenu } from "app/modules/products/components/FilterMenu/FilterMenu";
import { ProductsGrid } from "app/modules/products/components/ProductsGrid/ProductsGrid";
import {
  ProductsPageProvider,
  useProductsPageContext,
} from "app/modules/products/context";
import { useMediaQuery } from "hooks";
import { Flex, FlexItem, Section } from "layout";
import { useEffect } from "react";

function ProductsPageContent() {
  const { isMobile } = useMediaQuery();
  const { isFilterMenuOpen, closeFilterMenu } = useProductsPageContext();

  useEffect(() => {
    if (!isMobile) {
      closeFilterMenu();
    }
  }, [isMobile, closeFilterMenu]);

  const shouldShowFilterMenu = !isMobile || isFilterMenuOpen;

  return (
    <Section padding={isMobile ? "600" : "800"} variant="subtle">
      <Flex direction={isMobile ? "column" : "row"} gap="800" container>
        {shouldShowFilterMenu && isMobile && (
          <FilterMenu showMobileClose={isMobile} />
        )}
        {shouldShowFilterMenu && !isMobile && (
          <FlexItem>
            <FilterMenu showMobileClose={isMobile} />
          </FlexItem>
        )}
        <FlexItem size="full">
          <Flex direction="column" gap="600" container>
            <FilterBar />
            <ProductsGrid />
          </Flex>
        </FlexItem>
      </Flex>
    </Section>
  );
}

export default function ProductsPage() {
  return (
    <ProductsPageProvider>
      <ProductsPageContent />
    </ProductsPageProvider>
  );
}
