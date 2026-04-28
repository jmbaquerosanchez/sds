import { useProductsPageContext } from "app/modules/products/context";
import { Flex } from "layout";
import { Label, Tag } from "primitives";

export function KeywordList() {
  const { selectedTags, removeTag } = useProductsPageContext();

  if (!selectedTags.length) {
    return null;
  }

  return (
    <Flex direction="column" gap="200" data-testid="products-keyword-list">
      <Label>Keywords</Label>
      <Flex wrap gap="100">
        {selectedTags.map((tag) => (
          <Tag key={tag} onRemove={() => removeTag(tag)}>
            {tag}
          </Tag>
        ))}
      </Flex>
    </Flex>
  );
}
