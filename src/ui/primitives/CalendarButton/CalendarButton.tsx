import clsx from "clsx";
import React from "react";
import { Button as RACButton } from "react-aria-components";
import "./calendarButton.css";

export type CalendarButtonProps = Omit<
  React.ComponentProps<typeof RACButton>,
  "children"
> & {
  children?: React.ReactNode;
  isHidden?: boolean;
  isInRange?: boolean;
  isSelected?: boolean;
  label?: React.ReactNode;
};

export const CalendarButton = React.forwardRef(function CalendarButton(
  {
    className,
    children,
    isHidden = false,
    isInRange = false,
    isSelected = false,
    label = "1",
    ...props
  }: CalendarButtonProps,
  ref: React.ForwardedRef<HTMLButtonElement>,
) {
  if (isHidden) {
    return (
      <div
        aria-hidden
        className={clsx(
          "calendar-button",
          "calendar-button--hidden",
          className,
        )}
        role="presentation"
      />
    );
  }

  const content = children ?? label;
  const { type, ...restProps } = props;
  const buttonType = type ?? "button";

  return (
    <RACButton
      {...restProps}
      className={clsx(className, "calendar-button")}
      data-range={isInRange ? "" : undefined}
      data-selected={isSelected ? "" : undefined}
      ref={ref}
      type={buttonType}
    >
      {content}
    </RACButton>
  );
});
