import { figma } from "@figma/code-connect";
import { Calendar } from "compositions";

type RangeControls = {
  startDay?: string;
  endDay?: string;
};

figma.connect(Calendar, "<FIGMA_CALENDAR_CALENDAR>", {
  example: ({
    locale = "en-US",
    visibleMonth = 8,
    visibleYear = 2025,
    range,
  }: {
    locale?: string;
    visibleMonth?: number;
    visibleYear?: number;
    range?: RangeControls;
  }) => {
    const numericYear = Number(visibleYear ?? 2025);
    const startDay = safeNumber(range?.startDay, 9);
    const endDay = safeNumber(range?.endDay, 13);
    const start = createSafeDate(numericYear, visibleMonth, startDay);
    const end = createSafeDate(numericYear, visibleMonth, endDay);

    return (
      <Calendar
        locale={locale}
        visibleMonth={visibleMonth}
        visibleYear={numericYear}
        value={{ start, end }}
        onRangeChange={() => {}}
      />
    );
  },
});

function createSafeDate(year: number, month: number, day: number): Date {
  return new Date(year, month, Math.max(1, Math.round(day)));
}

function safeNumber(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}
