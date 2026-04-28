import type { Meta, StoryObj } from "@storybook/react";
import { CalendarButton } from "primitives";

const meta: Meta<typeof CalendarButton> = {
  title: "SDS Primitives/Calendar Button",
  component: CalendarButton,
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof CalendarButton>;

export const Playground: Story = {
  args: {
    label: "12",
    isDisabled: false,
    isHidden: false,
    isInRange: false,
    isSelected: false,
  },
  argTypes: {
    label: { control: { type: "text" } },
    isDisabled: { control: { type: "boolean" } },
    isHidden: { control: { type: "boolean" } },
    isInRange: { control: { type: "boolean" } },
    isSelected: { control: { type: "boolean" } },
  },
  render: ({ label, ...props }) => (
    <CalendarButton {...props}>{label}</CalendarButton>
  ),
};

export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: "flex", gap: "var(--sds-size-space-200)" }}>
      <CalendarButton>1</CalendarButton>
      <CalendarButton isSelected>1</CalendarButton>
      <CalendarButton isDisabled>1</CalendarButton>
      <CalendarButton isInRange>1</CalendarButton>
      <CalendarButton isInRange isDisabled>
        1
      </CalendarButton>
      <CalendarButton isHidden />
    </div>
  ),
};
