import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "app/core/constants/endpoints";
import type { Product } from "app/core/services/types/products";

const PRODUCTS_ENDPOINT = `${API_BASE_URL}/products`;

async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(PRODUCTS_ENDPOINT);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return (await response.json()) as Product[];
}

async function fetchProductById(productId: string): Promise<Product> {
  const response = await fetch(`${PRODUCTS_ENDPOINT}/${productId}`);

  if (response.status === 404) {
    throw new Error("Product not found");
  }

  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }

  return (await response.json()) as Product;
}

export function useProductsQuery() {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
}

export function useProductQuery(productId?: string) {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProductById(productId as string),
    enabled: Boolean(productId),
  });
}
