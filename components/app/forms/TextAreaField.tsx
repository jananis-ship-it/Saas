"use client";

import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type TextAreaFieldProps = {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  className?: string;
  description?: string;
};

export function TextAreaField({
  name,
  label,
  placeholder,
  required,
  disabled,
  rows = 4,
  className,
  description,
}: TextAreaFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const error = errors[name]?.message as string | undefined;

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      <Textarea
        id={name}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : description ? `${name}-desc` : undefined}
        className="rounded-md resize-y min-h-[80px]"
        {...register(name)}
      />
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
