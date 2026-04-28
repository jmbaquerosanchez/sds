import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "app/core/constants/endpoints";
import type { Review } from "app/core/services/types/reviews";

const REVIEWS_ENDPOINT = `${API_BASE_URL}/reviews`;

async function fetchProductReviews(productId: string): Promise<Review[]> {
  const response = await fetch(
    `${REVIEWS_ENDPOINT}?productId=${encodeURIComponent(productId)}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch reviews");
  }

  return (await response.json()) as Review[];
}

export function useProductReviewsQuery(productId?: string) {
  return useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => fetchProductReviews(productId as string),
    enabled: Boolean(productId),
  });
}
