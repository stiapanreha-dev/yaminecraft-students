import * as React from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import ru from "date-fns/locale/ru";
import { cn } from "@/lib/utils";

// Регистрируем русскую локаль
registerLocale("ru", ru);

function Calendar({
  className,
  selected,
  onSelect,
  mode = "single",
  disabled,
  ...props
}) {
  const handleChange = (date) => {
    if (onSelect) {
      onSelect(date);
    }
  };

  return (
    <div className={cn("calendar-wrapper", className)}>
      <DatePicker
        selected={selected}
        onChange={handleChange}
        locale="ru"
        inline
        disabled={disabled}
        dateFormat="dd.MM.yyyy"
        calendarClassName="bootstrap-datepicker"
        {...props}
      />
    </div>
  );
}

export { Calendar };
