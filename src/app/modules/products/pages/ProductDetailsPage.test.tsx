import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProductDetailsPage from "./ProductDetailsPage";

const mockUseProductQuery = vi.fn();
const mockUseProductReviewsQuery = vi.fn();
const mockUseAddToCartMutation = vi.fn();
const mockUseNewsletterSignup = vi.fn();
const mockUseAuth = vi.fn();
const mockUseMediaQuery = vi.fn();

vi.mock("app/core/services/productsService", () => ({
  useProductQuery: (...args: unknown[]) => mockUseProductQuery(...args),
}));

vi.mock("app/core/services/reviewsService", () => ({
  useProductReviewsQuery: (...args: unknown[]) =>
    mockUseProductReviewsQuery(...args),
}));

vi.mock("app/core/services/shoppingCartService", () => ({
  useAddToCartMutation: () => mockUseAddToCartMutation(),
}));

vi.mock("app/core/services/newsletterService", () => ({
  useNewsletterSignup: () => mockUseNewsletterSignup(),
}));

vi.mock("app/core/hooks", () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock("hooks", () => ({
  useMediaQuery: () => mockUseMediaQuery(),
}));

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );
  return {
    ...actual,
    useParams: () => ({ id: "2" }),
  };
});

describe("ProductDetailsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseMediaQuery.mockReturnValue({ isMobile: false, isDesktop: true });
    mockUseAuth.mockReturnValue({ user: { id: "1", name: "Test User" } });
    mockUseProductReviewsQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });
    mockUseAddToCartMutation.mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    });
    mockUseNewsletterSignup.mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    });
  });

  it("renders a loading state while fetching product data", () => {
    mockUseProductQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    render(<ProductDetailsPage />);

    expect(screen.getByTestId("product-details-loading")).toBeInTheDocument();
  });

  it("submits the cart request when attributes are not required", async () => {
    const mutateAsync = vi.fn().mockResolvedValue(undefined);
    mockUseAddToCartMutation.mockReturnValue({
      mutateAsync,
      isPending: false,
    });

    mockUseProductQuery.mockReturnValue({
      data: {
        id: "2",
        name: "Bluetooth Speaker",
        description: "Portable audio",
        price: 99.99,
        currency: "$",
        rating: 4.5,
        imageUrl: "https://picsum.photos/seed/speaker/200/200",
        category: "Electronics",
        inStock: true,
        attributes: [],
        tags: ["wireless"],
        registeredTimestamp: "2024-01-01T00:00:00Z",
      },
      isLoading: false,
      isError: false,
    });

    render(<ProductDetailsPage />);

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /add to cart/i }));

    expect(mutateAsync).toHaveBeenCalledWith({
      userId: "1",
      productId: "2",
      quantity: 1,
      decorators: [],
    });
    const status = await screen.findByTestId("product-details-cart-message");
    expect(status).toHaveTextContent(/added to your cart/i);
  });
});
