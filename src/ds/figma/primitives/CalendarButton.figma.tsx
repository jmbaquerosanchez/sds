import figma from "@figma/code-connect";
import { CalendarButton } from "primitives";

figma.connect(CalendarButton, "<FIGMA_CALENDAR_BUTTON>", {
  props: {
    label: figma.string("Number"),
    isHidden: figma.enum("State", { Hidden: true }),
    isInRange: figma.enum("State", { Range: true }),
    isSelected: figma.enum("State", { Active: true }),
    isDisabled: figma.enum("State", {
      Disabled: true,
      "Range Disabled": true,
    }),
  },
  example: ({ label, ...props }) => (
    <CalendarButton {...props}>{label}</CalendarButton>
  ),
});
