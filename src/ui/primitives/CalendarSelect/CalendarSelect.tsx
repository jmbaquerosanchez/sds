import clsx from "clsx";
import {
  SelectField,
  SelectItem,
  type SelectFieldProps,
} from "../Select/Select";
import "./calendar-select.css";

export type CalendarSelectOption = {
  id: string;
  label: string;
};

export const CALENDAR_SELECT_MONTHS: readonly CalendarSelectOption[] = [
  { id: "january", label: "January" },
  { id: "february", label: "February" },
  { id: "march", label: "March" },
  { id: "april", label: "April" },
  { id: "may", label: "May" },
  { id: "june", label: "June" },
  { id: "july", label: "July" },
  { id: "august", label: "August" },
  { id: "september", label: "September" },
  { id: "october", label: "October" },
  { id: "november", label: "November" },
  { id: "december", label: "December" },
] as const;

type BaseCalendarSelectProps = SelectFieldProps<CalendarSelectOption>;
export type CalendarSelectProps = Omit<
  BaseCalendarSelectProps,
  "children" | "items"
> & {
  options?: readonly CalendarSelectOption[];
  hasLabel?: boolean;
};

export function CalendarSelect({
  className,
  options = CALENDAR_SELECT_MONTHS,
  hasLabel = false,
  label = "Month",
  placeholder = "Select month",
  selectedKey,
  defaultSelectedKey,
  ...props
}: CalendarSelectProps) {
  const resolvedDefaultKey =
    defaultSelectedKey ??
    (selectedKey === undefined ? options[0]?.id : undefined);

  return (
    <SelectField
      {...props}
      className={clsx("calendar-select", className)}
      placeholder={placeholder}
      label={hasLabel ? label : undefined}
      selectedKey={selectedKey}
      defaultSelectedKey={resolvedDefaultKey}
    >
      {options.map(({ id, label: optionLabel }) => (
        <SelectItem id={id} key={id} textValue={optionLabel}>
          {optionLabel}
        </SelectItem>
      ))}
    </SelectField>
  );
}
