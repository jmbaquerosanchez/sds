import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { WaitingListPayload } from "app/core/services/waitingListService";
import { useSubmitWaitingList } from "app/core/services/waitingListService";
import type { Mock } from "vitest";
import WaitingListPage from "./WaitingListPage";

vi.mock("app/core/services/waitingListService", () => ({
  useSubmitWaitingList: vi.fn(),
}));

type MockedSubmitHook = {
  mutateAsync: ReturnType<
    typeof vi.fn<(payload: WaitingListPayload) => Promise<unknown>>
  >;
  isPending: boolean;
};

const mockUseSubmitWaitingList = useSubmitWaitingList as unknown as Mock;

function mockSubmitHook(overrides?: Partial<MockedSubmitHook>) {
  const fallbackMutate =
    vi.fn<(payload: WaitingListPayload) => Promise<unknown>>();
  const hookValue: MockedSubmitHook = {
    mutateAsync: overrides?.mutateAsync ?? fallbackMutate,
    isPending: overrides?.isPending ?? false,
  };
  mockUseSubmitWaitingList.mockReturnValue(hookValue);
  return hookValue;
}

describe("WaitingListPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("prevents submission when the email field is empty", async () => {
    const hook = mockSubmitHook();
    const user = userEvent.setup();

    render(<WaitingListPage />);

    await user.click(screen.getByTestId("waiting-list-submit-button"));

    expect(hook.mutateAsync).not.toHaveBeenCalled();
    await screen.findByText("Email is required");
  });

  it("validates the email format", async () => {
    mockSubmitHook();
    const user = userEvent.setup();

    render(<WaitingListPage />);

    await user.type(screen.getByLabelText("Email address"), "not-an-email");
    await user.click(screen.getByTestId("waiting-list-submit-button"));

    await screen.findByText("Enter a valid email address");
  });

  it("submits the form and resets on success", async () => {
    const payload: WaitingListPayload = { email: "jane@example.com" };
    const mutateAsync = vi
      .fn<(waitingPayload: WaitingListPayload) => Promise<unknown>>()
      .mockResolvedValue(undefined);
    mockSubmitHook({ mutateAsync });
    const user = userEvent.setup();

    render(<WaitingListPage />);

    await user.type(screen.getByLabelText("Email address"), payload.email);
    await user.click(screen.getByTestId("waiting-list-submit-button"));

    await waitFor(() => expect(mutateAsync).toHaveBeenCalledWith(payload));
    await waitFor(() =>
      expect(
        screen.getByTestId("waiting-list-success-message"),
      ).toBeInTheDocument(),
    );
    expect(screen.getByLabelText("Email address")).toHaveValue("");
  });

  it("shows an error message when submission fails", async () => {
    const mutateAsync = vi
      .fn<(waitingPayload: WaitingListPayload) => Promise<unknown>>()
      .mockRejectedValue(new Error("network"));
    mockSubmitHook({ mutateAsync });
    const user = userEvent.setup();

    render(<WaitingListPage />);

    await user.type(screen.getByLabelText("Email address"), "jane@example.com");
    await user.click(screen.getByTestId("waiting-list-submit-button"));

    await waitFor(() =>
      expect(
        screen.getByTestId("waiting-list-error-message"),
      ).toBeInTheDocument(),
    );
  });

  it("disables the submit button while pending", () => {
    mockSubmitHook({ isPending: true });

    render(<WaitingListPage />);

    const button = screen.getByTestId("waiting-list-submit-button");
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent("Submitting...");
  });
});
