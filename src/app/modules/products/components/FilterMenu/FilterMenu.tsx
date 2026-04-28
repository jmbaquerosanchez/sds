import { KeywordList } from "app/modules/products/components/KeywordList/KeywordList";
import { useProductsPageContext } from "app/modules/products/context";
import { IconX } from "icons";
import { Flex } from "layout";
import {
  CheckboxField,
  CheckboxGroup,
  IconButton,
  SliderField,
  Text,
} from "primitives";
import { useCallback } from "react";
import styles from "./FilterMenu.module.css";

interface FilterMenuProps {
  showMobileClose?: boolean;
}

export function FilterMenu({ showMobileClose = false }: FilterMenuProps) {
  const {
    availableTags,
    selectedTags,
    setSelectedTags,
    priceRange,
    setPriceRange,
    maxPrice,
    currencySymbol,
    isLoading,
    closeFilterMenu,
  } = useProductsPageContext();

  const handleTagsChange = useCallback(
    (value: string[]) => {
      if (value.length === availableTags.length) {
        setSelectedTags(availableTags);
        return;
      }
      setSelectedTags(value);
    },
    [availableTags, setSelectedTags],
  );

  const handlePriceChange = useCallback(
    (value: number | number[]) => {
      if (Array.isArray(value) && value.length === 2) {
        setPriceRange([value[0], value[1]]);
      }
    },
    [setPriceRange],
  );

  const sliderMaxValue = maxPrice || priceRange[1] || 1;
  const canFilterByPrice = maxPrice > 0;

  const formatPrice = useCallback(
    (value: number) => `${currencySymbol}${value.toFixed(0)}`,
    [currencySymbol],
  );

  return (
    <Flex
      className={styles.filterMenu}
      direction="column"
      gap="400"
      data-testid="products-filter-menu"
      aria-label="Product filters"
      container
    >
      <Flex alignPrimary="space-between" alignSecondary="center" container>
        <KeywordList />
        {showMobileClose && (
          <IconButton
            aria-label="Close filters"
            variant="subtle"
            size="small"
            onPress={closeFilterMenu}
            className={styles.closeButton}
          >
            <IconX size="16" />
          </IconButton>
        )}
      </Flex>
      {availableTags.length ? (
        <CheckboxGroup
          label="Select tags"
          value={selectedTags}
          onChange={handleTagsChange}
          data-testid="products-filter-tags"
        >
          <Flex direction="column" gap="100">
            {availableTags.map((tag) => (
              <CheckboxField
                key={tag}
                value={tag}
                isDisabled={isLoading}
                data-testid={`products-filter-tag-${tag}`}
              >
                {tag}
              </CheckboxField>
            ))}
          </Flex>
        </CheckboxGroup>
      ) : (
        <Text data-testid="products-filter-tags-empty">
          Tags will appear once products are available.
        </Text>
      )}
      <Flex direction="column" gap="200" container>
        <SliderField
          label="Price"
          minValue={0}
          maxValue={sliderMaxValue}
          value={priceRange}
          onChange={handlePriceChange}
          isDisabled={!canFilterByPrice}
          thumbLabels={["Minimum", "Maximum"]}
          showOutput
          data-testid="products-filter-price"
        />
        <Text aria-live="polite">
          {canFilterByPrice
            ? `${formatPrice(priceRange[0])} - ${formatPrice(priceRange[1])}`
            : "Pricing available soon"}
        </Text>
      </Flex>
    </Flex>
  );
}
