import {
  useSubmitContact,
  type ContactPayload,
} from "app/core/services/contactService";
import { FormBox, Hero } from "compositions";
import {
  Button,
  ButtonGroup,
  InputField,
  Text,
  TextareaField,
  TextContentTitle,
} from "primitives";
import { FormEvent, useCallback, useMemo, useState } from "react";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
type ContactFormField = keyof ContactPayload;
const CONTACT_FIELDS: ContactFormField[] = [
  "name",
  "surname",
  "email",
  "message",
];

const FIELD_LABELS: Record<ContactFormField, string> = {
  name: "Name",
  surname: "Surname",
  email: "Email",
  message: "Message",
};

const createEmptyValues = (): ContactPayload => ({
  name: "",
  surname: "",
  email: "",
  message: "",
});

const createEmptyErrors = (): Record<ContactFormField, string> => ({
  name: "",
  surname: "",
  email: "",
  message: "",
});

const createTouchedState = (
  value: boolean,
): Record<ContactFormField, boolean> => ({
  name: value,
  surname: value,
  email: value,
  message: value,
});

function validateField(field: ContactFormField, value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return `${FIELD_LABELS[field]} is required`;
  }
  if (field === "email" && !EMAIL_PATTERN.test(trimmed)) {
    return "Enter a valid email address";
  }
  return "";
}

function validateForm(values: ContactPayload) {
  const nextErrors = createEmptyErrors();
  CONTACT_FIELDS.forEach((field) => {
    nextErrors[field] = validateField(field, values[field]);
  });
  return nextErrors;
}

function hasValidationErrors(errors: Record<ContactFormField, string>) {
  return CONTACT_FIELDS.some((field) => Boolean(errors[field]));
}

type SubmissionStatus = "idle" | "success" | "error";

export default function ContactPage() {
  const { mutateAsync, isPending } = useSubmitContact();

  const [values, setValues] = useState<ContactPayload>(() =>
    createEmptyValues(),
  );
  const [errors, setErrors] = useState<Record<ContactFormField, string>>(() =>
    createEmptyErrors(),
  );
  const [touched, setTouched] = useState<Record<ContactFormField, boolean>>(
    () => createTouchedState(false),
  );
  const [status, setStatus] = useState<SubmissionStatus>("idle");

  const handleFieldChange = useCallback(
    (field: ContactFormField) => (value: string) => {
      setValues((prev) => ({
        ...prev,
        [field]: value,
      }));
      if (status !== "idle") {
        setStatus("idle");
      }
      if (touched[field]) {
        const fieldError = validateField(field, value);
        setErrors((prev) => ({
          ...prev,
          [field]: fieldError,
        }));
      }
    },
    [status, touched],
  );

  const handleFieldBlur = useCallback(
    (field: ContactFormField) => () => {
      setTouched((prev) => ({
        ...prev,
        [field]: true,
      }));
      setErrors((prev) => ({
        ...prev,
        [field]: validateField(field, values[field]),
      }));
    },
    [values],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = validateForm(values);
    setErrors(validation);
    setTouched(createTouchedState(true));

    if (hasValidationErrors(validation)) {
      return;
    }

    try {
      await mutateAsync(values);
      setValues(createEmptyValues());
      setErrors(createEmptyErrors());
      setTouched(createTouchedState(false));
      setStatus("success");
    } catch (error) {
      setStatus("error");
    }
  };

  const submitLabel = useMemo(
    () => (isPending ? "Sending..." : "Submit"),
    [isPending],
  );

  return (
    <Hero
      variant="subtle"
      flexProps={{
        gap: "800",
        alignPrimary: "center",
        alignSecondary: "center",
      }}
    >
      <TextContentTitle
        align="center"
        title="We would love to hear from you"
        subtitle="Share a few details and we will respond with a tailored plan."
      />
      <FormBox
        onSubmit={handleSubmit}
        validationBehavior="aria"
        aria-label="Contact us form"
        data-testid="contact-form"
        style={{ maxWidth: "320px", width: "100%" }}
      >
        <InputField
          label="Name"
          name="name"
          placeholder="Jane"
          value={values.name}
          onChange={handleFieldChange("name")}
          onBlur={handleFieldBlur("name")}
          autoComplete="given-name"
          isRequired
          isInvalid={Boolean(errors.name)}
          errorMessage={errors.name}
          data-testid="contact-form-name-input"
        />
        <InputField
          label="Surname"
          name="surname"
          placeholder="Appleseed"
          value={values.surname}
          onChange={handleFieldChange("surname")}
          onBlur={handleFieldBlur("surname")}
          autoComplete="family-name"
          isRequired
          isInvalid={Boolean(errors.surname)}
          errorMessage={errors.surname}
          data-testid="contact-form-surname-input"
        />
        <InputField
          label="Email"
          name="email"
          placeholder="you@example.com"
          value={values.email}
          onChange={handleFieldChange("email")}
          onBlur={handleFieldBlur("email")}
          autoComplete="email"
          type="email"
          inputMode="email"
          isRequired
          isInvalid={Boolean(errors.email)}
          errorMessage={errors.email}
          data-testid="contact-form-email-input"
        />
        <TextareaField
          label="Message"
          name="message"
          placeholder="Tell us about your project"
          value={values.message}
          onChange={handleFieldChange("message")}
          onBlur={handleFieldBlur("message")}
          isRequired
          isInvalid={Boolean(errors.message)}
          errorMessage={errors.message}
          data-testid="contact-form-message-input"
          isResizable={false}
        />
        <ButtonGroup align="justify">
          <Button
            type="submit"
            variant="primary"
            size="medium"
            isDisabled={isPending}
            data-testid="contact-form-submit-button"
          >
            {submitLabel}
          </Button>
        </ButtonGroup>
        {status === "success" && (
          <Text
            role="status"
            data-testid="contact-form-success-message"
            elementType="p"
          >
            Thanks for reaching out. Our team will reply shortly.
          </Text>
        )}
        {status === "error" && (
          <Text
            role="alert"
            data-testid="contact-form-error-message"
            elementType="p"
          >
            We could not send your message. Please try again.
          </Text>
        )}
      </FormBox>
    </Hero>
  );
}
