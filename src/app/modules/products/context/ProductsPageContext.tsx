import { useProductsQuery } from "app/core/services/productsService";
import type { Product } from "app/core/services/types/products";
import {
  ProductsPageContext,
  type QuickFilter,
} from "app/modules/products/context/ProductsPageContext.shared";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

//const TEN_DAYS_IN_MS = 10 * 24 * 60 * 60 * 1000;
const THIRTY_DAYS_IN_MS = 30 * 24 * 60 * 60 * 1000;
const TIME_THRESHOLD_FOR_NEW_PRODUCTS = THIRTY_DAYS_IN_MS;

function deriveAvailableTags(products: Product[]) {
  const tagSet = new Set<string>();
  products.forEach((product) => {
    product.tags?.forEach((tag) => {
      if (tag) {
        tagSet.add(tag);
      }
    });
  });
  return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
}

function isProductNew(product: Product) {
  if (!product.registeredTimestamp) {
    return false;
  }
  const registered = new Date(product.registeredTimestamp).getTime();
  if (Number.isNaN(registered)) {
    return false;
  }
  return Date.now() - registered <= TIME_THRESHOLD_FOR_NEW_PRODUCTS;
}

function sortByRegistrationDateDesc(products: Product[]) {
  return [...products].sort((a, b) => {
    const aDate = new Date(a.registeredTimestamp).getTime();
    const bDate = new Date(b.registeredTimestamp).getTime();
    return bDate - aDate;
  });
}

export function ProductsPageProvider({ children }: { children?: ReactNode }) {
  const { data = [], isLoading, isError } = useProductsQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [quickFilter, setQuickFilter] = useState<QuickFilter>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  const products = data;
  const availableTags = useMemo(
    () => deriveAvailableTags(products),
    [products],
  );
  const maxPrice = useMemo(
    () =>
      products.reduce(
        (max, product) => Math.max(max, Math.ceil(product.price)),
        0,
      ),
    [products],
  );
  const currencySymbol = products[0]?.currency || "$";

  useEffect(() => {
    if (!availableTags.length) {
      setSelectedTags([]);
      return;
    }

    setSelectedTags((prev) =>
      prev.filter((tag) => availableTags.includes(tag)),
    );
  }, [availableTags]);

  useEffect(() => {
    if (maxPrice === 0) {
      setPriceRange([0, 0]);
      return;
    }

    setPriceRange((prev) => {
      if (prev[1] === 0) {
        return [0, maxPrice];
      }
      const clampedMin = Math.max(0, Math.min(prev[0], maxPrice));
      const clampedMax = Math.max(clampedMin, Math.min(prev[1], maxPrice));
      if (clampedMin === prev[0] && clampedMax === prev[1]) {
        return prev;
      }
      return [clampedMin, clampedMax];
    });
  }, [maxPrice]);

  const hasPriceLimits = maxPrice > 0 && priceRange[1] > 0;
  const filteredProducts = useMemo(() => {
    if (!products.length) {
      return [];
    }

    const normalizedSearch = searchTerm.trim().toLowerCase();
    const normalizedTags = new Set(
      selectedTags.map((tag) => tag.toLowerCase()),
    );

    let result = products.filter((product) => {
      if (!normalizedTags.size) {
        return true;
      }
      const productTags = product.tags?.map((tag) => tag.toLowerCase()) ?? [];
      return Array.from(normalizedTags).every((tag) =>
        productTags.includes(tag),
      );
    });

    if (hasPriceLimits) {
      result = result.filter(
        (product) =>
          product.price >= priceRange[0] && product.price <= priceRange[1],
      );
    }

    if (normalizedSearch) {
      result = result.filter((product) =>
        product.description.toLowerCase().includes(normalizedSearch),
      );
    }

    switch (quickFilter) {
      case "new":
        return sortByRegistrationDateDesc(result.filter(isProductNew));
      case "price-asc":
        return [...result].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...result].sort((a, b) => b.price - a.price);
      case "rating":
        return [...result].sort((a, b) => b.rating - a.rating);
      default:
        return result;
    }
  }, [
    products,
    selectedTags,
    hasPriceLimits,
    priceRange,
    searchTerm,
    quickFilter,
  ]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleQuickFilterChange = useCallback((filter: QuickFilter) => {
    setQuickFilter(filter);
  }, []);

  const handleTagSelection = useCallback(
    (tags: string[]) => {
      const next = Array.from(new Set(tags)).filter((tag) =>
        availableTags.includes(tag),
      );
      next.sort((a, b) => availableTags.indexOf(a) - availableTags.indexOf(b));
      setSelectedTags(next);
    },
    [availableTags],
  );

  const handleTagRemoval = useCallback((tag: string) => {
    setSelectedTags((prev) => prev.filter((current) => current !== tag));
  }, []);

  const handlePriceRangeChange = useCallback((range: [number, number]) => {
    setPriceRange(range);
  }, []);

  const toggleFilterMenu = useCallback(() => {
    setIsFilterMenuOpen((prev) => !prev);
  }, []);

  const closeFilterMenu = useCallback(() => {
    setIsFilterMenuOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      products,
      filteredProducts,
      availableTags,
      selectedTags,
      priceRange,
      maxPrice,
      currencySymbol,
      searchTerm,
      quickFilter,
      isLoading,
      isError,
      isFilterMenuOpen,
      setSearchTerm: handleSearchChange,
      setQuickFilter: handleQuickFilterChange,
      setSelectedTags: handleTagSelection,
      removeTag: handleTagRemoval,
      setPriceRange: handlePriceRangeChange,
      toggleFilterMenu,
      closeFilterMenu,
    }),
    [
      products,
      filteredProducts,
      availableTags,
      selectedTags,
      priceRange,
      maxPrice,
      currencySymbol,
      searchTerm,
      quickFilter,
      isLoading,
      isError,
      isFilterMenuOpen,
      handleSearchChange,
      handleQuickFilterChange,
      handleTagSelection,
      handleTagRemoval,
      handlePriceRangeChange,
      toggleFilterMenu,
      closeFilterMenu,
    ],
  );

  return (
    <ProductsPageContext.Provider value={value}>
      {children}
    </ProductsPageContext.Provider>
  );
}
