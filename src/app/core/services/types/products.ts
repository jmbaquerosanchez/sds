export type ProductAttribute = 'size' | 'color';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  rating: number;
  imageUrl: string;
  category: string;
  inStock: boolean;
  attributes: ProductAttribute[];
  tags?: string[];
  registeredTimestamp: string; // ISO 8601 string
};