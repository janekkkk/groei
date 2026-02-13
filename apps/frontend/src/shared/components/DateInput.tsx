import { type ChangeEvent, type TouchEvent, useRef } from "react";
import { Input } from "@/shadcdn/components/ui/input";
import { Label } from "@/shadcdn/components/ui/label";

interface DateInputProps {
  label: string;
  name: string;
  value: string;
  onValueChange: (value: string) => void;
  required?: boolean;
}

export const DateInput = ({
  label,
  name,
  value,
  onValueChange,
  required = false,
}: DateInputProps) => {
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Prevent value updates while picker is open
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Prevent touch events from interfering with the date picker
  const handleTouchStart = (e: TouchEvent<HTMLInputElement>) => {
    e.stopPropagation();
  };

  const handleTouchMove = (e: TouchEvent<HTMLInputElement>) => {
    e.stopPropagation();
  };

  const handleTouchEnd = (e: TouchEvent<HTMLInputElement>) => {
    e.stopPropagation();
  };

  // Save date after picker closes
  const handleBlur = () => {
    if (dateInputRef.current) {
      const newValue = dateInputRef.current.value;
      onValueChange(newValue);
    }
  };

  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input
        ref={dateInputRef}
        type="date"
        name={name}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        required={required}
      />
    </div>
  );
};
