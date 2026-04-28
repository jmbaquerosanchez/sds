import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ContactPayload } from "app/core/services/contactService";
import { useSubmitContact } from "app/core/services/contactService";
import { type Mock } from "vitest";
import ContactPage from "./ContactPage";

vi.mock("app/core/services/contactService", () => ({
  useSubmitContact: vi.fn(),
}));

type MockedSubmitHook = {
  mutateAsync: ReturnType<
    typeof vi.fn<(payload: ContactPayload) => Promise<unknown>>
  >;
  isPending: boolean;
};

const mockUseSubmitContact = useSubmitContact as unknown as Mock;

function mockSubmitHook(overrides?: Partial<MockedSubmitHook>) {
  const fallbackMutate = vi.fn<(payload: ContactPayload) => Promise<unknown>>();
  const hookValue: MockedSubmitHook = {
    mutateAsync: overrides?.mutateAsync ?? fallbackMutate,
    isPending: overrides?.isPending ?? false,
  };
  mockUseSubmitContact.mockReturnValue(hookValue);
  return hookValue;
}

describe("ContactPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("prevents submission when required fields are empty", async () => {
    const hook = mockSubmitHook();
    const user = userEvent.setup();

    render(<ContactPage />);

    await user.click(screen.getByTestId("contact-form-submit-button"));

    expect(hook.mutateAsync).not.toHaveBeenCalled();
    await screen.findByText("Name is required");
    await screen.findByText("Surname is required");
    await screen.findByText("Email is required");
    await screen.findByText("Message is required");
  });

  it("submits the form and shows a success state", async () => {
    const payload: ContactPayload = {
      name: "Jane",
      surname: "Appleseed",
      email: "jane@example.com",
      message: "Tell me more",
    };
    const mutateAsync = vi
      .fn<(payload: ContactPayload) => Promise<unknown>>()
      .mockResolvedValue(undefined);
    mockSubmitHook({ mutateAsync });
    const user = userEvent.setup();

    render(<ContactPage />);

    await user.type(screen.getByLabelText("Name"), payload.name);
    await user.type(screen.getByLabelText("Surname"), payload.surname);
    await user.type(screen.getByLabelText("Email"), payload.email);
    await user.type(screen.getByLabelText("Message"), payload.message);

    await user.click(screen.getByTestId("contact-form-submit-button"));

    await waitFor(() => expect(mutateAsync).toHaveBeenCalledWith(payload));
    await waitFor(() =>
      expect(
        screen.getByTestId("contact-form-success-message"),
      ).toBeInTheDocument(),
    );
    expect(screen.getByLabelText("Name")).toHaveValue("");
    expect(screen.getByLabelText("Surname")).toHaveValue("");
    expect(screen.getByLabelText("Email")).toHaveValue("");
    expect(screen.getByLabelText("Message")).toHaveValue("");
  });

  it("shows an error message when the submission fails", async () => {
    const mutateAsync = vi
      .fn<(payload: ContactPayload) => Promise<unknown>>()
      .mockRejectedValue(new Error("network"));
    mockSubmitHook({ mutateAsync });
    const user = userEvent.setup();

    render(<ContactPage />);

    await user.type(screen.getByLabelText("Name"), "Jane");
    await user.type(screen.getByLabelText("Surname"), "Appleseed");
    await user.type(screen.getByLabelText("Email"), "jane@example.com");
    await user.type(screen.getByLabelText("Message"), "Tell me more");

    await user.click(screen.getByTestId("contact-form-submit-button"));

    await waitFor(() =>
      expect(
        screen.getByTestId("contact-form-error-message"),
      ).toBeInTheDocument(),
    );
  });

  it("disables the submit button while a request is pending", () => {
    mockSubmitHook({ isPending: true });

    render(<ContactPage />);

    const button = screen.getByTestId("contact-form-submit-button");
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent("Sending...");
  });
});
