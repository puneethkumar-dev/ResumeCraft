import { forwardRef } from "react";
import { cn } from "../../utils/cn";
import { ChevronDown } from "lucide-react";

const Select = forwardRef(({
  className,
  label,
  error,
  options = [],
  placeholder = "Select an option",
  children,
  ...props
}, ref) => {
  return (
    <div className="w-full text-left">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative rounded-xl shadow-xs">
        <select
          ref={ref}
          className={cn(
            "block w-full appearance-none rounded-xl border bg-white dark:bg-slate-900 py-2.5 pl-4 pr-10 text-sm outline-hidden transition-all duration-200 dark:text-white cursor-pointer",
            error 
              ? "border-red-500 focus:ring-2 focus:ring-red-500/20 focus:border-red-500" 
              : "border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500",
            className
          )}
          {...props}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {children || options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </div>
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
});

Select.displayName = "Select";

export { Select };
