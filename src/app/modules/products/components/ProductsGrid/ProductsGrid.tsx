import { ROUTES } from "app/core/router/routes";
import { useProductsPageContext } from "app/modules/products/context";
import {
  ProductInfoCard,
  ProductInfoCardSkeleton,
  productToProductInfoCardProps,
} from "compositions";
import { useMediaQuery } from "hooks";
import { Flex, FlexItem } from "layout";
import { Text } from "primitives";
import { Link } from "react-router-dom";
import "./ProductsGrid.css";

const SKELETON_COUNT = 6;

export function ProductsGrid() {
  const { filteredProducts, isLoading, isError } = useProductsPageContext();
  const { isMobile, isTablet } = useMediaQuery();

  if (isError) {
    return (
      <Text role="alert" data-testid="products-grid-error">
        We could not load the products. Please refresh and try again.
      </Text>
    );
  }

  if (isLoading) {
    return (
      <Flex
        container
        gap={isMobile ? "300" : "800"}
        wrap
        data-testid="products-grid-loading"
      >
        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
          <FlexItem
            key={`product-skeleton-${index}`}
            size={isTablet ? "half" : "minor"}
          >
            <ProductInfoCardSkeleton />
          </FlexItem>
        ))}
      </Flex>
    );
  }

  if (!filteredProducts.length) {
    return (
      <Text data-testid="products-grid-empty">
        No products match your current filters.
      </Text>
    );
  }

  return (
    <Flex container wrap gap={"600"} type="third" data-testid="products-grid">
      {filteredProducts.map((product) => (
        <FlexItem key={product.id} size={isTablet ? "half" : "minor"}>
          <Link
            to={ROUTES.PRODUCT_DETAILS.replace(":id", product.id)}
            className="products-grid-link"
            data-testid={`product-card-link-${product.id}`}
          >
            <ProductInfoCard {...productToProductInfoCardProps(product)} />
          </Link>
        </FlexItem>
      ))}
    </Flex>
  );
}
