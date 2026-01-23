import type { Meta, StoryObj } from "@storybook/react";
import { Calendar, type CalendarRange } from "compositions";
import { useMemo, useState } from "react";

const meta: Meta<typeof Calendar> = {
  component: Calendar,
  title: "SDS Compositions/Calendar",
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof Calendar>;

function useRangeState(initialValue: CalendarRange) {
  const [range, setRange] = useState<CalendarRange>(initialValue);
  return { range, setRange };
}

export const Playground: Story = {
  args: {
    locale: "en-US",
  },
  render: (args) => {
    const { range, setRange } = useRangeState({ start: null, end: null });
    return <Calendar {...args} value={range} onRangeChange={setRange} />;
  },
};

export const PrefilledRange: Story = {
  render: () => {
    const initialRange: CalendarRange = {
      start: new Date(2025, 0, 2),
      end: new Date(2025, 0, 10),
    };
    const { range, setRange } = useRangeState(initialRange);
    return (
      <Calendar
        defaultVisibleMonth={0}
        defaultVisibleYear={2025}
        value={range}
        onRangeChange={setRange}
      />
    );
  },
};

export const LocalizedLabels: Story = {
  render: () => {
    const baseRange: CalendarRange = useMemo(
      () => ({ start: new Date(2025, 8, 9), end: new Date(2025, 8, 13) }),
      [],
    );
    const { range, setRange } = useRangeState(baseRange);
    return (
      <Calendar
        locale="fr-FR"
        defaultVisibleMonth={8}
        defaultVisibleYear={2025}
        value={range}
        onRangeChange={setRange}
      />
    );
  },
};
