import { forwardRef } from "react";
import { cn } from "../../utils/cn";

const Input = forwardRef(({
  className,
  type = "text",
  label,
  error,
  icon: Icon,
  rightElement,
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
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <Icon className="h-4 w-4 text-slate-400 dark:text-slate-500" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            "block w-full rounded-xl border bg-white dark:bg-slate-900 py-2.5 px-4 text-sm outline-hidden transition-all duration-200 dark:text-white",
            error 
              ? "border-red-500 focus:ring-2 focus:ring-red-500/20 focus:border-red-500" 
              : "border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500",
            Icon && "pl-10",
            rightElement && "pr-10",
            className
          )}
          {...props}
        />
        {rightElement && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export { Input };
