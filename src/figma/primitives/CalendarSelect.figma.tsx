import figma from "@figma/code-connect";
import { CALENDAR_SELECT_MONTHS, CalendarSelect } from "primitives";

const monthEnum = CALENDAR_SELECT_MONTHS.reduce<Record<string, string>>(
  (acc, option) => ({
    ...acc,
    [option.label]: option.id,
  }),
  {},
);

const baseProps = {
  isDisabled: figma.enum("State", { Disabled: true }),
  defaultSelectedKey: figma.enum("Value", monthEnum),
  placeholder: figma.enum("Value Type", {
    default: "Select month",
    Placeholder: figma.string("Placeholder"),
  }),
  isOpen: figma.enum("Open", { Open: true }),
};

figma.connect(CalendarSelect, "<FIGMA_CALENDAR_SELECT>", {
  variant: { "Has Label": false },
  props: baseProps,
  example: ({ defaultSelectedKey, ...props }) => (
    <CalendarSelect
      {...props}
      hasLabel={false}
      defaultSelectedKey={defaultSelectedKey}
    />
  ),
});

figma.connect(CalendarSelect, "<FIGMA_CALENDAR_SELECT>", {
  variant: { "Has Label": true },
  props: {
    ...baseProps,
    label: figma.string("Label"),
  },
  example: ({ defaultSelectedKey, label, ...props }) => (
    <CalendarSelect
      {...props}
      hasLabel
      label={label}
      defaultSelectedKey={defaultSelectedKey}
    />
  ),
});
