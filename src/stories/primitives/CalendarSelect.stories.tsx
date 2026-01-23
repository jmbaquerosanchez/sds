import type { Meta, StoryObj } from "@storybook/react";
import { CalendarSelect } from "primitives";

const yearOptions = [
  { id: "2023", label: "2023" },
  { id: "2024", label: "2024" },
  { id: "2025", label: "2025" },
  { id: "2026", label: "2026" },
  { id: "2027", label: "2027" },
];

const meta: Meta<typeof CalendarSelect> = {
  component: CalendarSelect,
  title: "SDS Primitives/Calendar Select",
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof CalendarSelect>;

export const Playground: Story = {
  args: {
    hasLabel: false,
  },
};

export const WithLabel: Story = {
  args: {
    hasLabel: true,
    label: "Month",
    defaultSelectedKey: "september",
  },
};

export const Disabled: Story = {
  args: {
    hasLabel: false,
    isDisabled: true,
  },
};

export const Years: Story = {
  name: "Year Selector",
  args: {
    hasLabel: true,
    label: "Year",
    options: yearOptions,
    defaultSelectedKey: "2025",
  },
};
