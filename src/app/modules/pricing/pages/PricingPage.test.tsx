import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import type { MockInstance } from "vitest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import PricingPage from "./PricingPage";

type FetchInput = Parameters<typeof fetch>[0];

const monthlyPlans = [
  {
    id: "starter-month",
    name: "Starter",
    description: "Starter plan",
    price: 25,
    currency: "$",
    interval: "month",
    features: ["Feature A", "Feature B"],
    sku: "starter",
  },
];

const yearlyPlans = [
  {
    id: "starter-year",
    name: "Starter Yearly",
    description: "Starter yearly plan",
    price: 250,
    currency: "$",
    interval: "year",
    features: ["Feature C", "Feature D"],
    sku: "starter-year",
  },
];

const faqs = [
  { question: "How does billing work?", answer: "We bill per active seat." },
];

function createResponse<T>(data: T): Promise<Response> {
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve(data),
  } as Response);
}

describe("PricingPage", () => {
  let fetchSpy: MockInstance<
    (input: FetchInput, init?: RequestInit) => Promise<Response>
  >;

  beforeEach(() => {
    fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockImplementation((input: FetchInput) => {
        const url = input instanceof URL ? input.toString() : String(input);

        if (url.includes("/plans")) {
          if (url.includes("interval=year")) {
            return createResponse(yearlyPlans);
          }
          return createResponse(monthlyPlans);
        }

        if (url.includes("/faqs")) {
          return createResponse(faqs);
        }

        throw new Error(`Unhandled fetch call: ${url}`);
      });
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  function renderPage() {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    return render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <PricingPage />
        </QueryClientProvider>
      </MemoryRouter>,
    );
  }

  it("loads monthly plans by default", async () => {
    renderPage();

    await waitFor(() =>
      expect(screen.getByTestId("plan-card-starter-month")).toBeVisible(),
    );
    expect(screen.getByText("Starter")).toBeInTheDocument();
  });

  it("switches plans when selecting yearly interval", async () => {
    renderPage();
    const user = userEvent.setup();

    await user.click(screen.getByTestId("pricing-interval-pill-year"));

    await waitFor(() =>
      expect(screen.getByTestId("plan-card-starter-year")).toBeVisible(),
    );
    expect(screen.getByText("Starter Yearly")).toBeInTheDocument();
  });

  it("renders FAQ entries", async () => {
    renderPage();

    await waitFor(() =>
      expect(screen.getByTestId("page-accordion-list")).toBeVisible(),
    );
    expect(screen.getByText("How does billing work?")).toBeInTheDocument();
  });
});
