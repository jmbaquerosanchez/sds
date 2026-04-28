import { useSubmitWaitingList } from "app/core/services/waitingListService";
import { Hero } from "compositions";
import { Button, Form, InputField, Text, TextContentTitle } from "primitives";
import { FormEvent, useCallback, useMemo, useState } from "react";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return "Email is required";
  }
  if (!EMAIL_PATTERN.test(trimmed)) {
    return "Enter a valid email address";
  }
  return "";
}

type SubmissionStatus = "idle" | "success" | "error";

export default function WaitingListPage() {
  const { mutateAsync, isPending } = useSubmitWaitingList();
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<SubmissionStatus>("idle");

  const showFieldError = touched && Boolean(error);

  const handleChange = useCallback(
    (value: string) => {
      if (status !== "idle") {
        setStatus("idle");
      }
      setEmail(value);
      if (touched) {
        setError(validateEmail(value));
      }
    },
    [status, touched],
  );

  const handleBlur = useCallback(() => {
    setTouched(true);
    setError(validateEmail(email));
  }, [email]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched(true);
    const validationError = validateEmail(email);
    setError(validationError);

    if (validationError) {
      return;
    }

    try {
      await mutateAsync({ email: email.trim() });
      setStatus("success");
      setEmail("");
      setError("");
      setTouched(false);
    } catch (error_) {
      console.error(error_);
      setStatus("error");
    }
  };

  const submitLabel = useMemo(
    () => (isPending ? "Submitting..." : "Submit"),
    [isPending],
  );

  return (
    <Hero variant="subtle">
      <TextContentTitle
        align="center"
        title="Be first in line"
        subtitle="Join the waiting list and we will reach out when new seats open."
      />
      <Form
        aria-label="Waiting list form"
        singleLine
        validationBehavior="aria"
        onSubmit={handleSubmit}
        data-testid="waiting-list-form"
      >
        <InputField
          aria-label="Email address"
          name="email"
          placeholder="you@example.com"
          value={email}
          onChange={handleChange}
          onBlur={handleBlur}
          inputMode="email"
          type="email"
          autoComplete="email"
          isRequired
          isInvalid={showFieldError}
          errorMessage={showFieldError ? error : ""}
          data-testid="waiting-list-email-input"
        />
        <Button
          type="submit"
          variant="neutral"
          size="medium"
          isDisabled={isPending}
          data-testid="waiting-list-submit-button"
          style={{ alignSelf: "flex-start" }}
        >
          {submitLabel}
        </Button>
      </Form>
      {status === "success" && (
        <Text
          role="status"
          style={{ textAlign: "center" }}
          data-testid="waiting-list-success-message"
        >
          Thanks! We will keep you posted as soon as new spots unlock.
        </Text>
      )}
      {status === "error" && (
        <Text
          role="alert"
          style={{ textAlign: "center" }}
          data-testid="waiting-list-error-message"
        >
          Something went wrong. Please try again.
        </Text>
      )}
    </Hero>
  );
}
