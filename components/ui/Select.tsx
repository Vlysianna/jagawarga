import { SelectHTMLAttributes, forwardRef, ReactNode } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  children: ReactNode;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, id, children, className = "", ...props }, ref) => {
    const selectId = id || label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={selectId}
          className="text-sm font-medium text-neutral-dark"
        >
          {label}
        </label>
        <select
          ref={ref}
          id={selectId}
          className={`
            w-full px-4 py-3 text-base rounded-xl border
            bg-white text-foreground
            border-neutral-border
            focus:outline-none focus:ring-2 focus:ring-blue-border focus:border-blue-primary
            disabled:opacity-50 disabled:bg-neutral-bg
            appearance-none
            ${error ? "border-red-danger focus:ring-red-danger/30" : ""}
            ${className}
          `}
          {...props}
        >
          {children}
        </select>
        {error && (
          <p className="text-sm text-red-danger">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
