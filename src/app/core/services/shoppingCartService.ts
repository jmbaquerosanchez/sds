import { useMutation } from "@tanstack/react-query";
import { API_BASE_URL } from "app/core/constants/endpoints";
import type { ShoppingCartItem } from "app/core/services/types/shoppingCart";

async function submitShoppingCartItem(
  payload: ShoppingCartItem,
): Promise<ShoppingCartItem> {
  const response = await fetch(`${API_BASE_URL}/shoppingCart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to add the product to the shopping cart");
  }

  const responseBody = await response.text();
  return responseBody
    ? (JSON.parse(responseBody) as ShoppingCartItem)
    : payload;
}

export function useAddToCartMutation() {
  return useMutation({
    mutationKey: ["shoppingCart", "submit"],
    mutationFn: submitShoppingCartItem,
  });
}
