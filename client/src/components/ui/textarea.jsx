import { forwardRef } from "react";
import { cn } from "../../utils/cn";

const Textarea = forwardRef(({
  className,
  label,
  error,
  rows = 4,
  ...props
}, ref) => {
  return (
    <div className="w-full text-left">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          "block w-full rounded-xl border bg-white dark:bg-slate-900 py-2.5 px-4 text-sm outline-hidden transition-all duration-200 dark:text-white resize-y",
          error 
            ? "border-red-500 focus:ring-2 focus:ring-red-500/20 focus:border-red-500" 
            : "border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500",
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
});

Textarea.displayName = "Textarea";

export { Textarea };
