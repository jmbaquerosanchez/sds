import { useContext } from "react";
import { ProductsPageContext } from "app/modules/products/context/ProductsPageContext.shared";

export function useProductsPageContext() {
  const context = useContext(ProductsPageContext);
  if (!context) {
    throw new Error(
      "useProductsPageContext must be used within ProductsPageProvider",
    );
  }
  return context;
}
