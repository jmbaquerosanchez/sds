import { createContext } from "react";
import type { Product } from "app/core/services/types/products";

export type QuickFilter = "new" | "price-asc" | "price-desc" | "rating" | null;

export interface ProductsPageContextValue {
  products: Product[];
  filteredProducts: Product[];
  availableTags: string[];
  selectedTags: string[];
  priceRange: [number, number];
  maxPrice: number;
  currencySymbol: string;
  searchTerm: string;
  quickFilter: QuickFilter;
  isLoading: boolean;
  isError: boolean;
  isFilterMenuOpen: boolean;
  setSearchTerm(value: string): void;
  setQuickFilter(filter: QuickFilter): void;
  setSelectedTags(tags: string[]): void;
  removeTag(tag: string): void;
  setPriceRange(range: [number, number]): void;
  toggleFilterMenu(): void;
  closeFilterMenu(): void;
}

export const ProductsPageContext = createContext<
  ProductsPageContextValue | undefined
>(undefined);
