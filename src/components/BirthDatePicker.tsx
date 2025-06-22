import * as React from "react";
import { format, getYear, getMonth, setYear, setMonth } from "date-fns";
import { Calendar as CalendarBase } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface BirthDatePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
}

export function BirthDatePicker({ value, onChange }: BirthDatePickerProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) =>
    (currentYear - i).toString()
  );
  const months = Array.from({ length: 12 }, (_, i) => ({
    label: format(new Date(2020, i, 1), "MM"),
    value: i.toString(),
  }));

  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    value
  );

  const handleYearChange = (yearStr: string) => {
    const year = Number(yearStr);
    if (selectedDate) {
      const updated = setYear(selectedDate, year);
      setSelectedDate(updated);
      onChange(updated);
    }
  };

  const handleMonthChange = (monthStr: string) => {
    const month = Number(monthStr);
    if (selectedDate) {
      const updated = setMonth(selectedDate, month);
      setSelectedDate(updated);
      onChange(updated);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    onChange(date);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground"
          )}
        >
          {selectedDate ? format(selectedDate, "dd-MM-yyyy") : "Chọn ngày"}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2">
        <div className="flex gap-2 mb-2">
          <Select
            value={getMonth(selectedDate ?? new Date()).toString()}
            onValueChange={handleMonthChange}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Tháng" />
            </SelectTrigger>
            <SelectContent>
              {months.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={getYear(selectedDate ?? new Date()).toString()}
            onValueChange={handleYearChange}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Năm" />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <CalendarBase
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
