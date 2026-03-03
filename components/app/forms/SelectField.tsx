"use client";

import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Option = { value: string; label: string };

type SelectFieldProps = {
  name: string;
  label: string;
  options: Option[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  description?: string;
};

export function SelectField({
  name,
  label,
  options,
  placeholder = "Select…",
  required,
  disabled,
  className,
  description,
}: SelectFieldProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const value = watch(name);
  const error = errors[name]?.message as string | undefined;

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      <input type="hidden" {...register(name)} />
      <Select
        value={value ?? ""}
        onValueChange={(v) => setValue(name, v, { shouldValidate: true })}
        disabled={disabled}
      >
        <SelectTrigger
          id={name}
          className="w-full rounded-md"
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {description && !error && (
        <p id={`${name}-desc`} className="text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {error && (
        <p id={`${name}-error`} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
