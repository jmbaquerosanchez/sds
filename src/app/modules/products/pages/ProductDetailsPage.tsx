import { useAuth } from "app/core/hooks";
import { useNewsletterSignup } from "app/core/services/newsletterService";
import { useProductQuery } from "app/core/services/productsService";
import { useProductReviewsQuery } from "app/core/services/reviewsService";
import { useAddToCartMutation } from "app/core/services/shoppingCartService";
import type { ProductAttribute } from "app/core/services/types/products";
import type { ShoppingCartItem } from "app/core/services/types/shoppingCart";
import { COLORS, SIZES } from "app/core/services/types/shoppingCart";
import { ReviewCard } from "compositions";
import { useMediaQuery } from "hooks";
import { IconHeart, IconShoppingCart } from "icons";
import { Flex, FlexItem, Section } from "layout";
import {
  Accordion,
  AccordionItem,
  Button,
  Form,
  IconButton,
  Image,
  InputField,
  SelectField,
  SelectItem,
  Tag,
  Text,
  TextContentHeading,
  TextHeading,
  TextPrice,
} from "primitives";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import type { Key } from "react-aria-components";
import { useParams } from "react-router-dom";

const ATTRIBUTE_OPTIONS: Record<ProductAttribute, readonly string[]> = {
  size: SIZES,
  color: COLORS,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type CartStatus = {
  type: "success" | "error";
  message: string;
};

type NewsletterStatus = "idle" | "success" | "error";

type AttributeSelections = Partial<Record<ProductAttribute, string | null>>;

type ProductRouteParams = {
  id: string;
};

function validateEmail(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return "Email is required";
  }
  if (!EMAIL_PATTERN.test(trimmed)) {
    return "Enter a valid email";
  }
  return "";
}

function formatAttributeLabel(attribute: ProductAttribute) {
  return attribute.charAt(0).toUpperCase() + attribute.slice(1);
}

function extractReviewCopy(comment: string) {
  const trimmed = comment.trim();
  if (!trimmed) {
    return { title: "Product review", body: "" };
  }
  const segments = trimmed.split(/\.[\s\r\n]+/);
  const [first, ...rest] = segments;
  if (!rest.length) {
    return { title: trimmed, body: trimmed };
  }
  return {
    title: `${first}.`,
    body: `${rest.join(". ")}.`,
  };
}

function formatReviewDate(timestamp?: string, fallbackOffset = 0) {
  const parsedTimestamp = timestamp ? Date.parse(timestamp) : NaN;
  const date = Number.isNaN(parsedTimestamp)
    ? new Date(Date.now() - fallbackOffset * 24 * 60 * 60 * 1000)
    : new Date(parsedTimestamp);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ProductDetailsPage() {
  const { id: productId } = useParams<ProductRouteParams>();
  const { user } = useAuth();
  const { isMobile, isDesktop } = useMediaQuery();
  const {
    data: product,
    isLoading: isProductLoading,
    isError: isProductError,
    error: productError,
  } = useProductQuery(productId);
  const {
    data: reviews = [],
    isLoading: areReviewsLoading,
    isError: areReviewsError,
  } = useProductReviewsQuery(productId);
  const visibleReviews = useMemo(() => {
    const toTime = (timestamp: string) => {
      const time = Date.parse(timestamp);
      return Number.isNaN(time) ? 0 : time;
    };
    return reviews
      .slice()
      .sort(
        (a, b) => toTime(b.registeredTimestamp) - toTime(a.registeredTimestamp),
      )
      .slice(0, 3);
  }, [reviews]);
  const addToCartMutation = useAddToCartMutation();
  const newsletterMutation = useNewsletterSignup();

  const [favorite, setFavorite] = useState(false);
  const [attributeSelections, setAttributeSelections] =
    useState<AttributeSelections>({});
  const [attrValidationAttempted, setAttrValidationAttempted] = useState(false);
  const [cartStatus, setCartStatus] = useState<CartStatus | null>(null);
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [newsletterStatus, setNewsletterStatus] =
    useState<NewsletterStatus>("idle");

  const attributeFields = useMemo(() => {
    if (!product?.attributes?.length) {
      return [] as ProductAttribute[];
    }
    return product.attributes.filter(
      (attribute): attribute is ProductAttribute =>
        Boolean(ATTRIBUTE_OPTIONS[attribute]?.length),
    );
  }, [product]);

  useEffect(() => {
    if (!product) {
      setAttributeSelections({});
      setAttrValidationAttempted(false);
      setCartStatus(null);
      setFavorite(false);
      return;
    }
    setAttributeSelections((prev) => {
      const next: AttributeSelections = {};
      attributeFields.forEach((attribute) => {
        next[attribute] = prev[attribute] ?? null;
      });
      return next;
    });
    setAttrValidationAttempted(false);
    setCartStatus(null);
    setFavorite(false);
  }, [product, attributeFields]);

  const allAttributesSelected = attributeFields.every((attribute) =>
    Boolean(attributeSelections[attribute]),
  );

  const handleAttributeChange = useCallback(
    (attribute: ProductAttribute, key: Key | null) => {
      setAttributeSelections((prev) => ({
        ...prev,
        [attribute]: key ? String(key) : null,
      }));
      if (attrValidationAttempted) {
        setAttrValidationAttempted(false);
      }
    },
    [attrValidationAttempted],
  );

  const handleAddToCart = useCallback(async () => {
    if (!product || !user?.id) {
      setCartStatus({
        type: "error",
        message: "Please sign in to add products to your cart.",
      });
      return;
    }

    if (attributeFields.length && !allAttributesSelected) {
      setAttrValidationAttempted(true);
      setCartStatus({
        type: "error",
        message: "Select an option for every available attribute.",
      });
      return;
    }

    try {
      const decorators: ShoppingCartItem["decorators"] = attributeFields.map(
        (attribute) => ({
          key: attribute,
          value: attributeSelections[
            attribute
          ] as ShoppingCartItem["decorators"][number]["value"],
        }),
      );

      await addToCartMutation.mutateAsync({
        userId: user.id,
        productId: product.id,
        quantity: 1,
        decorators,
      });

      setCartStatus({
        type: "success",
        message: `${product.name} was added to your cart.`,
      });
    } catch (error) {
      console.error(error);
      setCartStatus({
        type: "error",
        message: "We couldn't add this product to your cart. Please try again.",
      });
    }
  }, [
    product,
    user,
    attributeFields,
    allAttributesSelected,
    attributeSelections,
    addToCartMutation,
  ]);

  const handleEmailChange = useCallback(
    (value: string) => {
      setEmail(value);
      if (emailTouched) {
        setEmailError(validateEmail(value));
      }
      if (newsletterStatus !== "idle") {
        setNewsletterStatus("idle");
      }
    },
    [emailTouched, newsletterStatus],
  );

  const handleEmailBlur = useCallback(() => {
    setEmailTouched(true);
    setEmailError(validateEmail(email));
  }, [email]);

  const handleNewsletterSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEmailTouched(true);
    const validation = validateEmail(email);
    setEmailError(validation);

    if (validation) {
      return;
    }

    try {
      await newsletterMutation.mutateAsync({
        email: email.trim(),
        registeredTimestamp: new Date().toISOString(),
      });
      setNewsletterStatus("success");
      setEmail("");
      setEmailError("");
      setEmailTouched(false);
    } catch (error) {
      console.error(error);
      setNewsletterStatus("error");
    }
  };

  if (isProductLoading) {
    return (
      <Section
        padding={isMobile ? "600" : "1600"}
        data-testid="product-details-loading"
      >
        <Text>Loading product information...</Text>
      </Section>
    );
  }

  if (isProductError || !product) {
    const message =
      productError instanceof Error
        ? productError.message
        : "We couldn't find that product.";
    return (
      <Section
        padding={isMobile ? "600" : "1600"}
        data-testid="product-details-error"
      >
        <Text role="alert">{message}</Text>
      </Section>
    );
  }

  const priceLabel = product.inStock ? "In stock" : "Currently unavailable";
  const addToCartLabel = addToCartMutation.isPending
    ? "Adding..."
    : "Add to cart";
  const isAddDisabled =
    addToCartMutation.isPending ||
    !product.inStock ||
    (attributeFields.length > 0 && !allAttributesSelected);

  const newsletterButtonLabel = newsletterMutation.isPending
    ? "Submitting..."
    : "Subscribe";

  const sectionPadding = isMobile ? "600" : "1600";
  const flexGap = isMobile ? "600" : "1200";
  const productTags = product.tags?.slice(0, 3) ?? [];

  return (
    <>
      <Section
        padding={sectionPadding}
        variant="subtle"
        data-testid="product-details-section"
      >
        <Flex container type="half" wrap gap={flexGap}>
          <FlexItem size="half">
            <div
              style={{
                position: "relative",
                width: "100%",
              }}
            >
              <Image
                src={product.imageUrl}
                alt={product.name}
                size="large"
                aspectRatio="4-3"
              />
              <IconButton
                aria-label={
                  favorite ? "Remove from favorites" : "Add to favorites"
                }
                variant="subtle"
                onPress={() => setFavorite((prev) => !prev)}
                data-testid="product-favorite-button"
                style={{
                  position: "absolute",
                  top: "var(--sds-size-space-200)",
                  right: "var(--sds-size-space-200)",
                }}
              >
                <IconHeart aria-hidden="true" />
              </IconButton>
            </div>
          </FlexItem>
          <FlexItem size="half">
            <Flex direction="column" gap="400" alignSecondary="stretch">
              <TextHeading>{product.name}</TextHeading>
              <Flex gap="200" wrap>
                {productTags.length > 0 &&
                  productTags.map((tag) => (
                    <Tag
                      key={tag}
                      scheme={product.inStock ? "positive" : "neutral"}
                      variant="secondary"
                    >
                      {tag}
                    </Tag>
                  ))}
              </Flex>
              <Flex direction="column" gap="100">
                <TextPrice
                  currency={product.currency}
                  price={product.price.toFixed(2)}
                  label="/ item"
                />
                <Text>
                  Rating {product.rating.toFixed(1)} / 5 • {priceLabel}
                </Text>
              </Flex>
              <Text>{product.description}</Text>
              {attributeFields.length > 0 && (
                <Flex
                  wrap
                  gap="200"
                  direction={isDesktop ? "row" : "column"}
                  alignSecondary={isDesktop ? "end" : "stretch"}
                >
                  {attributeFields.map((attribute) => {
                    const label = formatAttributeLabel(attribute);
                    const options = ATTRIBUTE_OPTIONS[attribute] ?? [];
                    const showError =
                      attrValidationAttempted &&
                      !attributeSelections[attribute];
                    return (
                      <FlexItem key={attribute} size="fill">
                        <SelectField
                          label={label}
                          placeholder={`Select a ${label.toLowerCase()}...`}
                          selectedKey={
                            attributeSelections[attribute] ?? undefined
                          }
                          onSelectionChange={(key) =>
                            handleAttributeChange(attribute, key)
                          }
                          errorMessage={
                            showError
                              ? `Choose a ${label.toLowerCase()} option`
                              : undefined
                          }
                          data-testid={`product-attribute-${attribute}`}
                        >
                          {options.map((option) => (
                            <SelectItem id={option} key={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectField>
                      </FlexItem>
                    );
                  })}
                  <Button
                    variant="primary"
                    size="medium"
                    onPress={handleAddToCart}
                    isDisabled={isAddDisabled}
                    data-testid="product-details-add-to-cart-button"
                  >
                    {addToCartLabel}
                    <IconShoppingCart aria-hidden="true" />
                  </Button>
                </Flex>
              )}
              {attributeFields.length === 0 && (
                <Button
                  variant="primary"
                  size="medium"
                  onPress={handleAddToCart}
                  isDisabled={isAddDisabled}
                  data-testid="product-details-add-to-cart-button"
                  style={{ alignSelf: "flex-start" }}
                >
                  {addToCartLabel}
                  <IconShoppingCart aria-hidden="true" />
                </Button>
              )}
              {cartStatus && (
                <Text
                  role={cartStatus.type === "success" ? "status" : "alert"}
                  data-testid="product-details-cart-message"
                >
                  {cartStatus.message}
                </Text>
              )}
              <Accordion>
                <AccordionItem title="Product details">
                  <Text>
                    Crafted for everyday use, {product.name} ships quickly and
                    is backed by our 30-day return policy. Choose the options
                    that fit your workflow and enjoy premium support.
                  </Text>
                </AccordionItem>
              </Accordion>
            </Flex>
          </FlexItem>
        </Flex>
      </Section>

      <Section padding={sectionPadding}>
        <Flex container direction="column" gap="600" alignSecondary="stretch">
          <TextHeading>Latest reviews</TextHeading>
          {areReviewsLoading && <Text>Loading reviews...</Text>}
          {areReviewsError && !areReviewsLoading && (
            <Text role="alert">We couldn't load reviews right now.</Text>
          )}
          {!areReviewsLoading && !areReviewsError && reviews.length === 0 && (
            <Text>No reviews yet. Be the first to share your experience.</Text>
          )}
          {!areReviewsLoading && !areReviewsError && reviews.length > 0 && (
            <Flex
              gap={flexGap}
              type="third"
              alignPrimary="start"
              alignSecondary="stretch"
            >
              {visibleReviews.map((review, index) => {
                const copy = extractReviewCopy(review.comment);
                return (
                  <FlexItem key={review.id} size={isMobile ? "full" : "minor"}>
                    <ReviewCard
                      stars={review.rating}
                      title={copy.title}
                      body={copy.body}
                      name={review.user}
                      date={formatReviewDate(review.registeredTimestamp, index)}
                      src={review.avatar}
                    />
                  </FlexItem>
                );
              })}
            </Flex>
          )}
        </Flex>
      </Section>

      <Section padding={sectionPadding} variant="stroke">
        <Flex
          container
          direction="column"
          gap="600"
          alignPrimary="center"
          alignSecondary="center"
        >
          <TextContentHeading
            align="center"
            heading="Follow the latest trends"
            subheading="With our daily newsletter"
          />
          <Form
            singleLine
            validationBehavior="aria"
            onSubmit={handleNewsletterSubmit}
            data-testid="product-newsletter-form"
          >
            <InputField
              aria-label="Email address"
              name="email"
              placeholder="you@example.com"
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              inputMode="email"
              type="email"
              autoComplete="email"
              isRequired
              isInvalid={emailTouched && Boolean(emailError)}
              errorMessage={emailTouched ? emailError : undefined}
              data-testid="product-newsletter-input"
            />
            <Button
              type="submit"
              variant="neutral"
              size="medium"
              isDisabled={newsletterMutation.isPending}
              data-testid="product-newsletter-submit-button"
              style={{ alignSelf: "flex-start" }}
            >
              {newsletterButtonLabel}
            </Button>
          </Form>
          {newsletterStatus === "success" && (
            <Text role="status" data-testid="product-newsletter-success">
              Thanks for subscribing! Check your inbox for the first drop.
            </Text>
          )}
          {newsletterStatus === "error" && (
            <Text role="alert" data-testid="product-newsletter-error">
              Something went wrong. Please try again in a moment.
            </Text>
          )}
        </Flex>
      </Section>
    </>
  );
}
