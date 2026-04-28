import { ProductAttribute } from "./products";

export const SIZES = ['S', 'M', 'L', 'XL'] as const;
export const COLORS = ['red', 'blue', 'green', 'black', 'white'] as const;

type AttributeValue<T extends ProductAttribute> = T extends 'size'
  ? (typeof SIZES)[number]
  : T extends 'color'
  ? (typeof COLORS)[number]
  : never;

type ProductDecorator<T extends ProductAttribute> = {
  key: T;
  value: AttributeValue<T>;
};

export type ShoppingCartItem = {
  userId: string;
  productId: string;
  quantity: number;
  decorators: ProductDecorator<ProductAttribute>[];
}