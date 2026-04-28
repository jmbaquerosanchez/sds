import figma from "@figma/code-connect";
import { CalendarSelect } from "primitives";

const baseProps = {
  defaultSelectedKey: figma.enum("Value", {
    January: "january",
    February: "february",
    March: "march",
    April: "april",
    May: "may",
    June: "june",
    July: "july",
    August: "august",
    September: "september",
    October: "october",
    November: "november",
    December: "december",
  }),
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
