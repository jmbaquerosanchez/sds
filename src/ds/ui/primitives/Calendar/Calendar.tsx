import clsx from "clsx";
import { IconChevronLeft, IconChevronRight } from "icons";
import {
  CalendarButton,
  CalendarSelect,
  CalendarSelectOption,
  IconButton,
} from "primitives";
import {
  ComponentPropsWithoutRef,
  Key,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import "./calendar.css";

const DEFAULT_MIN_YEAR = 1950;
const DEFAULT_MAX_YEAR = 2050;

type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

type VisibleMonth = {
  month: number;
  year: number;
};

type CalendarCell = {
  date: Date;
  isCurrentMonth: boolean;
};

export type CalendarRange = {
  start: Date | null;
  end: Date | null;
};

export type CalendarProps = ComponentPropsWithoutRef<"div"> & {
  locale?: string;
  minYear?: number;
  maxYear?: number;
  weekStartsOn?: Weekday;
  value?: CalendarRange;
  defaultValue?: CalendarRange;
  onRangeChange?: (range: CalendarRange) => void;
  visibleMonth?: number;
  visibleYear?: number;
  defaultVisibleMonth?: number;
  defaultVisibleYear?: number;
  onVisibleMonthChange?: (visible: VisibleMonth) => void;
};

export function Calendar({
  className,
  locale,
  minYear,
  maxYear,
  weekStartsOn,
  value,
  defaultValue,
  onRangeChange,
  visibleMonth,
  visibleYear,
  defaultVisibleMonth,
  defaultVisibleYear,
  onVisibleMonthChange,
  children,
  "aria-label": ariaLabel,
  ...domProps
}: CalendarProps) {
  const resolvedLocale = locale ?? getDefaultLocale();
  const resolvedMinYear = minYear ?? DEFAULT_MIN_YEAR;
  const resolvedMaxYear = maxYear ?? DEFAULT_MAX_YEAR;
  const today = useMemo(() => startOfDay(new Date()), []);

  const [internalRange, setInternalRange] = useState<CalendarRange>(() =>
    normalizeRange(defaultValue ?? { start: null, end: null }),
  );

  const [internalVisible, setInternalVisible] = useState<VisibleMonth>(() => ({
    month: clampMonth(defaultVisibleMonth ?? visibleMonth ?? today.getMonth()),
    year: clampYear(
      defaultVisibleYear ?? visibleYear ?? today.getFullYear(),
      resolvedMinYear,
      resolvedMaxYear,
    ),
  }));

  useEffect(() => {
    setInternalVisible((prev) => {
      const nextMonth =
        visibleMonth === undefined ? clampMonth(prev.month) : prev.month;
      const nextYear =
        visibleYear === undefined
          ? clampYear(prev.year, resolvedMinYear, resolvedMaxYear)
          : prev.year;
      if (nextMonth === prev.month && nextYear === prev.year) {
        return prev;
      }
      return { month: nextMonth, year: nextYear };
    });
  }, [resolvedMinYear, resolvedMaxYear, visibleMonth, visibleYear]);

  const monthInView = clampMonth(
    visibleMonth !== undefined ? visibleMonth : internalVisible.month,
  );
  const yearInView = clampYear(
    visibleYear !== undefined ? visibleYear : internalVisible.year,
    resolvedMinYear,
    resolvedMaxYear,
  );

  const baseRange = value ?? internalRange;
  const normalizedRange = useMemo(() => normalizeRange(baseRange), [baseRange]);

  const localeWeekStart = useMemo(
    () =>
      weekStartsOn !== undefined
        ? clampWeekday(weekStartsOn)
        : getWeekStart(resolvedLocale),
    [weekStartsOn, resolvedLocale],
  );

  const monthFormatter = useMemo(
    () => createFormatter(resolvedLocale, { month: "long", year: "numeric" }),
    [resolvedLocale],
  );
  const dayFormatter = useMemo(
    () => createFormatter(resolvedLocale, { dateStyle: "full" }),
    [resolvedLocale],
  );
  const weekdayFormatter = useMemo(
    () => createFormatter(resolvedLocale, { weekday: "short" }),
    [resolvedLocale],
  );
  const monthOptionFormatter = useMemo(
    () => createFormatter(resolvedLocale, { month: "short" }),
    [resolvedLocale],
  );

  const monthOptions = useMemo(() => {
    const options: CalendarSelectOption[] = [];
    for (let monthIndex = 0; monthIndex < 12; monthIndex += 1) {
      const label = monthOptionFormatter.format(new Date(2024, monthIndex, 1));
      options.push({ id: monthIndex.toString(), label });
    }
    return options;
  }, [monthOptionFormatter]);

  const yearOptions = useMemo(() => {
    const options: CalendarSelectOption[] = [];
    for (let year = resolvedMinYear; year <= resolvedMaxYear; year += 1) {
      options.push({ id: year.toString(), label: year.toString() });
    }
    return options;
  }, [resolvedMinYear, resolvedMaxYear]);

  const weekdayLabels = useMemo(() => {
    return Array.from({ length: 7 }, (_, index) => {
      const day = (localeWeekStart + index) % 7;
      const refDate = new Date(Date.UTC(2024, 0, 7 + day));
      return weekdayFormatter.format(refDate);
    });
  }, [weekdayFormatter, localeWeekStart]);

  const weeks = useMemo(
    () => buildCalendarMatrix(yearInView, monthInView, localeWeekStart),
    [yearInView, monthInView, localeWeekStart],
  );

  const calendarLabel =
    ariaLabel ??
    `${monthFormatter.format(new Date(yearInView, monthInView, 1))} calendar`;
  const classNames = clsx("calendar", className);

  const applyRangeChange = useCallback(
    (nextRange: CalendarRange) => {
      const normalized = normalizeRange(nextRange);
      if (value === undefined) {
        setInternalRange(normalized);
      }
      onRangeChange?.(normalized);
    },
    [onRangeChange, value],
  );

  const updateVisible = useCallback(
    (next: VisibleMonth) => {
      const nextMonth = clampMonth(next.month);
      const nextYear = clampYear(next.year, resolvedMinYear, resolvedMaxYear);
      setInternalVisible((prev) => {
        if (visibleMonth === undefined || visibleYear === undefined) {
          return {
            month: visibleMonth === undefined ? nextMonth : prev.month,
            year: visibleYear === undefined ? nextYear : prev.year,
          };
        }
        return prev;
      });
      onVisibleMonthChange?.({ month: nextMonth, year: nextYear });
    },
    [
      visibleMonth,
      visibleYear,
      onVisibleMonthChange,
      resolvedMinYear,
      resolvedMaxYear,
    ],
  );

  const handleDayPress = useCallback(
    (date: Date) => {
      const safeDate = startOfDay(date);
      const { start, end } = normalizedRange;
      if (!start || end) {
        applyRangeChange({ start: safeDate, end: null });
        return;
      }
      if (safeDate.getTime() < start.getTime()) {
        applyRangeChange({ start: safeDate, end: null });
        return;
      }
      if (safeDate.getTime() === start.getTime()) {
        applyRangeChange({ start, end: safeDate });
        return;
      }
      applyRangeChange({ start, end: safeDate });
    },
    [applyRangeChange, normalizedRange],
  );

  const handleMonthSelection = useCallback(
    (key: Key | null) => {
      if (key === null || typeof key !== "string") {
        return;
      }
      const monthIndex = Number(key);
      if (Number.isNaN(monthIndex)) {
        return;
      }
      updateVisible({ month: monthIndex, year: yearInView });
    },
    [updateVisible, yearInView],
  );

  const handleYearSelection = useCallback(
    (key: Key | null) => {
      if (key === null || typeof key !== "string") {
        return;
      }
      const numericYear = Number(key);
      if (Number.isNaN(numericYear)) {
        return;
      }
      updateVisible({ month: monthInView, year: numericYear });
    },
    [monthInView, updateVisible],
  );

  const canGoPrev =
    yearInView > resolvedMinYear ||
    (yearInView === resolvedMinYear && monthInView > 0);
  const canGoNext =
    yearInView < resolvedMaxYear ||
    (yearInView === resolvedMaxYear && monthInView < 11);

  const goToPreviousMonth = useCallback(() => {
    if (!canGoPrev) {
      return;
    }
    const nextMonth = monthInView === 0 ? 11 : monthInView - 1;
    const nextYear = monthInView === 0 ? yearInView - 1 : yearInView;
    updateVisible({ month: nextMonth, year: nextYear });
  }, [canGoPrev, monthInView, yearInView, updateVisible]);

  const goToNextMonth = useCallback(() => {
    if (!canGoNext) {
      return;
    }
    const nextMonth = monthInView === 11 ? 0 : monthInView + 1;
    const nextYear = monthInView === 11 ? yearInView + 1 : yearInView;
    updateVisible({ month: nextMonth, year: nextYear });
  }, [canGoNext, monthInView, yearInView, updateVisible]);

  return (
    <div {...domProps} aria-label={calendarLabel} className={classNames}>
      <div className="calendar-header">
        <IconButton
          aria-label="Go to previous month"
          isDisabled={!canGoPrev}
          size="small"
          variant="subtle"
          onPress={goToPreviousMonth}
        >
          <IconChevronLeft size="20" />
        </IconButton>
        <div className="calendar-select-group">
          <CalendarSelect
            aria-label="Select month"
            options={monthOptions}
            selectedKey={monthInView.toString()}
            onSelectionChange={handleMonthSelection}
          />
          <CalendarSelect
            aria-label="Select year"
            options={yearOptions}
            selectedKey={yearInView.toString()}
            onSelectionChange={handleYearSelection}
          />
        </div>
        <IconButton
          aria-label="Go to next month"
          isDisabled={!canGoNext}
          size="small"
          variant="subtle"
          onPress={goToNextMonth}
        >
          <IconChevronRight size="20" />
        </IconButton>
      </div>
      <div className="calendar-body">
        <table className="calendar-table" role="grid" aria-readonly="true">
          <thead>
            <tr>
              {weekdayLabels.map((label, index) => (
                <th key={`${label}-${index}`} scope="col">
                  <span className="calendar-weekday">{label}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, rowIndex) => (
              <tr key={`week-${rowIndex}`} role="row">
                {week.map((cell) => {
                  const isToday = isSameDay(cell.date, today);
                  const isSelected =
                    (!!normalizedRange.start &&
                      isSameDay(cell.date, normalizedRange.start)) ||
                    (!!normalizedRange.end &&
                      isSameDay(cell.date, normalizedRange.end));
                  const isInRange =
                    normalizedRange.start &&
                    normalizedRange.end &&
                    cell.date.getTime() > normalizedRange.start.getTime() &&
                    cell.date.getTime() < normalizedRange.end.getTime();
                  const ariaCurrent = isToday ? "date" : undefined;
                  const ariaPressed =
                    isSelected || isInRange ? true : undefined;
                  const label = cell.date.getDate().toString();
                  return (
                    <td
                      className="calendar-cell"
                      key={cell.date.toISOString()}
                      role="gridcell"
                    >
                      <CalendarButton
                        aria-current={ariaCurrent}
                        aria-label={dayFormatter.format(cell.date)}
                        aria-pressed={ariaPressed}
                        isDisabled={!cell.isCurrentMonth}
                        isInRange={Boolean(isInRange)}
                        isSelected={Boolean(isSelected)}
                        label={label}
                        onPress={() => handleDayPress(cell.date)}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {children}
    </div>
  );
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function normalizeRange(range: CalendarRange): CalendarRange {
  const start = range.start ? startOfDay(range.start) : null;
  const end = range.end ? startOfDay(range.end) : null;
  if (start && end && end.getTime() < start.getTime()) {
    return { start: end, end: start };
  }
  return { start, end };
}

function clampMonth(month: number): number {
  if (Number.isNaN(month)) {
    return 0;
  }
  if (month < 0) {
    return 0;
  }
  if (month > 11) {
    return 11;
  }
  return month;
}

function clampYear(year: number, min: number, max: number): number {
  if (Number.isNaN(year)) {
    return min;
  }
  return Math.min(Math.max(year, min), max);
}

function clampWeekday(day: number): Weekday {
  const normalized = ((day % 7) + 7) % 7;
  return normalized as Weekday;
}

function getDefaultLocale(): string {
  if (typeof navigator !== "undefined" && navigator.language) {
    return navigator.language;
  }
  return "en-US";
}

function getWeekStart(locale: string): Weekday {
  if (typeof Intl !== "undefined" && "Locale" in Intl) {
    try {
      const localeInfo = new Intl.Locale(locale);
      const firstDay = "weekInfo" in localeInfo 
        ? (localeInfo.weekInfo as { firstDay?: number })?.firstDay
        : undefined;
      if (typeof firstDay === "number") {
        return clampWeekday(firstDay % 7);
      }
    } catch {
      // ignore and fall through to default
    }
  }
  return 0;
}

function createFormatter(locale: string, options: Intl.DateTimeFormatOptions) {
  try {
    return new Intl.DateTimeFormat(locale, options);
  } catch {
    return new Intl.DateTimeFormat("en-US", options);
  }
}

function buildCalendarMatrix(
  year: number,
  month: number,
  weekStart: Weekday,
): CalendarCell[][] {
  const firstOfMonth = new Date(year, month, 1);
  const offset = (firstOfMonth.getDay() - weekStart + 7) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells = Math.ceil((offset + daysInMonth) / 7) * 7;
  const cells: CalendarCell[] = [];

  for (let cellIndex = 0; cellIndex < totalCells; cellIndex += 1) {
    const dayNumber = cellIndex - offset + 1;
    const cellDate = new Date(year, month, dayNumber);
    cells.push({
      date: cellDate,
      isCurrentMonth: cellDate.getMonth() === month,
    });
  }

  const weeks: CalendarCell[][] = [];
  for (let index = 0; index < cells.length; index += 7) {
    weeks.push(cells.slice(index, index + 7));
  }
  return weeks;
}
