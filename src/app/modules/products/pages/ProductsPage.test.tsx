import { render, screen, waitFor } from "@testing-library/react";
import type { ProductsPageContextValue } from "app/modules/products/context/ProductsPageContext.shared";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProductsPage from "./ProductsPage";

type MediaQueryMatches = {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTabletUp: boolean;
  isTabletDown: boolean;
};

type FilterMenuProps = {
  showMobileClose: boolean;
};

type ProviderProps = {
  children?: ReactNode;
};

const filterMenuPropsSpy = vi.fn<(props: FilterMenuProps) => void>();

function createMediaQueryMatches(
  overrides?: Partial<MediaQueryMatches>,
): MediaQueryMatches {
  return {
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isTabletUp: true,
    isTabletDown: false,
    ...overrides,
  };
}

function createContextValue(
  overrides?: Partial<ProductsPageContextValue>,
): ProductsPageContextValue {
  return {
    products: [],
    filteredProducts: [],
    availableTags: [],
    selectedTags: [],
    priceRange: [0, 0],
    maxPrice: 0,
    currencySymbol: "$",
    searchTerm: "",
    quickFilter: null,
    isLoading: false,
    isError: false,
    isFilterMenuOpen: false,
    setSearchTerm: vi.fn(),
    setQuickFilter: vi.fn(),
    setSelectedTags: vi.fn(),
    removeTag: vi.fn(),
    setPriceRange: vi.fn(),
    toggleFilterMenu: vi.fn(),
    closeFilterMenu: vi.fn(),
    ...overrides,
  };
}

let mediaQueryMatches: MediaQueryMatches = createMediaQueryMatches();
let contextValue: ProductsPageContextValue = createContextValue();

const mockUseMediaQuery = vi.fn(() => mediaQueryMatches);
const mockUseProductsPageContext = vi.fn(() => contextValue);

vi.mock("hooks", () => ({
  useMediaQuery: () => mockUseMediaQuery(),
}));

vi.mock("app/modules/products/context", () => ({
  ProductsPageProvider: ({ children }: ProviderProps) => (
    <div data-testid="products-page-provider">{children}</div>
  ),
  useProductsPageContext: () => mockUseProductsPageContext(),
}));

vi.mock("app/modules/products/components/FilterBar/FilterBar", () => ({
  FilterBar: () => <div data-testid="filter-bar">Filter Bar</div>,
}));

vi.mock("app/modules/products/components/FilterMenu/FilterMenu", () => ({
  FilterMenu: (props: FilterMenuProps) => {
    filterMenuPropsSpy(props);
    return (
      <div data-testid="filter-menu">
        {props.showMobileClose ? "mobile-menu" : "desktop-menu"}
      </div>
    );
  },
}));

vi.mock("app/modules/products/components/ProductsGrid/ProductsGrid", () => ({
  ProductsGrid: () => <div data-testid="products-grid">Products Grid</div>,
}));

function setMediaQueryMatches(overrides?: Partial<MediaQueryMatches>) {
  mediaQueryMatches = createMediaQueryMatches(overrides);
}

function setContextValue(
  overrides?: Partial<ProductsPageContextValue>,
): ProductsPageContextValue {
  contextValue = createContextValue(overrides);
  return contextValue;
}

describe("ProductsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setMediaQueryMatches();
    setContextValue();
    filterMenuPropsSpy.mockClear();
  });

  it("renders the provider wrapper, filter controls, and grid", () => {
    setMediaQueryMatches({ isMobile: false });

    render(<ProductsPage />);

    expect(screen.getByTestId("products-page-provider")).toBeInTheDocument();
    expect(screen.getByTestId("filter-bar")).toBeInTheDocument();
    expect(screen.getByTestId("products-grid")).toBeInTheDocument();
    expect(screen.getByTestId("filter-menu")).toBeInTheDocument();
  });

  it("only shows the filter menu on mobile when it is open", () => {
    setMediaQueryMatches({ isMobile: true });
    setContextValue({ isFilterMenuOpen: false });

    const { rerender } = render(<ProductsPage />);

    expect(screen.queryByTestId("filter-menu")).not.toBeInTheDocument();

    setContextValue({ isFilterMenuOpen: true });
    rerender(<ProductsPage />);

    expect(screen.getByTestId("filter-menu")).toBeInTheDocument();
  });

  it("always renders the filter menu on desktop for quick access", () => {
    setMediaQueryMatches({ isMobile: false });
    setContextValue({ isFilterMenuOpen: false });

    render(<ProductsPage />);

    expect(screen.getByTestId("filter-menu")).toBeInTheDocument();
  });

  it("passes the expected showMobileClose prop to FilterMenu", () => {
    setContextValue({ isFilterMenuOpen: true });
    setMediaQueryMatches({ isMobile: true });

    const { rerender } = render(<ProductsPage />);

    expect(filterMenuPropsSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({ showMobileClose: true }),
    );

    filterMenuPropsSpy.mockClear();

    setMediaQueryMatches({ isMobile: false });
    rerender(<ProductsPage />);

    expect(filterMenuPropsSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({ showMobileClose: false }),
    );
  });

  it("closes the filter menu automatically when switching to desktop", async () => {
    const closeFilterMenu = vi.fn();
    setContextValue({ closeFilterMenu });
    setMediaQueryMatches({ isMobile: true });

    const { rerender } = render(<ProductsPage />);

    expect(closeFilterMenu).not.toHaveBeenCalled();

    setMediaQueryMatches({ isMobile: false });
    rerender(<ProductsPage />);

    await waitFor(() => expect(closeFilterMenu).toHaveBeenCalledTimes(1));
  });
});
