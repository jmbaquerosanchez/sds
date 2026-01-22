import figma from "@figma/code-connect";
import { CalendarButton, type CalendarButtonProps } from "primitives";

type CalendarButtonState =
  | "Default"
  | "Hover"
  | "Active"
  | "Disabled"
  | "Range"
  | "Range Disabled"
  | "Hidden";

const statePropsMap: Record<
  CalendarButtonState,
  Partial<CalendarButtonProps>
> = {
  Default: {},
  Hover: { "data-hovered": "" },
  Active: { isSelected: true },
  Disabled: { isDisabled: true },
  Range: { isInRange: true },
  "Range Disabled": { isInRange: true, isDisabled: true },
  Hidden: { isHidden: true },
};

figma.connect(CalendarButton, "<FIGMA_CALENDAR_BUTTON>", {
  props: {
    label: figma.string("Number"),
    state: figma.enum("State", {
      Default: "Default",
      Hover: "Hover",
      Active: "Active",
      Disabled: "Disabled",
      Range: "Range",
      "Range Disabled": "Range Disabled",
      Hidden: "Hidden",
    }),
  },
  example: ({ label, state }) => (
    <CalendarButton {...statePropsMap[state]}>{label}</CalendarButton>
  ),
});
