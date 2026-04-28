import type { Key } from "@react-types/shared";
import { useProductsPageContext } from "app/modules/products/context";
import { useMediaQuery } from "hooks";
import { IconFilter } from "icons";
import { Flex } from "layout";
import {
  IconButton,
  Search,
  TagToggle,
  TagToggleGroup,
  TagToggleList,
} from "primitives";
import { useCallback, useMemo } from "react";
import { Selection } from "react-aria-components";

const QUICK_FILTERS = [
  { id: "new", label: "New" },
  { id: "price-asc", label: "Price ascending" },
  { id: "price-desc", label: "Price descending" },
  { id: "rating", label: "Rating" },
] as const;

export function FilterBar() {
  const { setSearchTerm, setQuickFilter, quickFilter, toggleFilterMenu } =
    useProductsPageContext();
  const { isMobile } = useMediaQuery();

  const selectedKeys = useMemo(() => {
    if (!quickFilter) {
      return new Set<Key>();
    }
    return new Set<Key>([quickFilter]);
  }, [quickFilter]);

  const handleSearch = useCallback(
    (value: string) => {
      setSearchTerm(value);
    },
    [setSearchTerm],
  );

  const handleQuickFilterChange = useCallback(
    (selection: Selection) => {
      if (selection === "all") {
        return;
      }
      const keys = Array.from(selection as Set<Key>);
      const nextKey = keys[0];
      setQuickFilter((nextKey as (typeof QUICK_FILTERS)[number]["id"]) ?? null);
    },
    [setQuickFilter],
  );

  return (
    <Flex
      direction={isMobile ? "column" : "row"}
      gap={"600"}
      alignPrimary={isMobile ? "stretch" : "space-between"}
      alignSecondary={isMobile ? "stretch" : "center"}
      data-testid="products-filter-bar"
      container
    >
      <Flex gap="200" alignSecondary="center">
        <Search
          placeholder="Search descriptions"
          aria-label="Search products"
          onSearch={handleSearch}
        />
        {isMobile && (
          <IconButton
            aria-label="Toggle filters"
            variant="subtle"
            onPress={toggleFilterMenu}
          >
            <IconFilter />
          </IconButton>
        )}
      </Flex>
      <Flex direction="column" gap="100">
        <TagToggleGroup
          selectionMode="single"
          selectionBehavior="toggle"
          selectedKeys={selectedKeys}
          onSelectionChange={handleQuickFilterChange}
          data-testid="products-quick-filters"
        >
          <TagToggleList>
            {QUICK_FILTERS.map(({ id, label }) => (
              <TagToggle key={id} id={id} textValue={label}>
                {label}
              </TagToggle>
            ))}
          </TagToggleList>
        </TagToggleGroup>
      </Flex>
    </Flex>
  );
}
