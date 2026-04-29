import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = "", ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-neutral-dark"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-3 text-base rounded-xl border
            bg-white text-foreground
            placeholder:text-neutral-text/50
            border-neutral-border
            focus:outline-none focus:ring-2 focus:ring-blue-border focus:border-blue-primary
            disabled:opacity-50 disabled:bg-neutral-bg
            ${error ? "border-red-danger focus:ring-red-danger/30" : ""}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-danger">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
