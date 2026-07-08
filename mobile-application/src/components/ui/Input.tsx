// src/components/ui/Input.tsx
"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="og-field">
        <label htmlFor={inputId} className="og-field-label">
          {label}
        </label>
        <input ref={ref} id={inputId} className="og-field-input" {...props} />
        {error && <span className="og-field-error">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";
