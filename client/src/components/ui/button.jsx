import { forwardRef } from "react";
import { cn } from "../../utils/cn";

const Button = forwardRef(({
  className,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  children,
  icon: Icon,
  iconPosition = "left",
  type = "button",
  ...props
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-bold rounded-xl transition-all duration-300 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-violet-500 disabled:opacity-50 disabled:pointer-events-none active:scale-95 cursor-pointer";

  const variants = {
    primary: "bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] text-white hover:scale-[1.025] hover:brightness-95 hover:shadow-lg hover:shadow-[#7C3AED]/25 border-0 shadow-md shadow-[#7C3AED]/15",
    secondary: "border-2 border-[#7C3AED]/50 hover:border-[#7C3AED] text-[#7C3AED] dark:text-[#a78bfa] bg-transparent hover:bg-[#7C3AED]/10 hover:scale-[1.025] hover:shadow-sm",
    outline: "border-2 border-[#7C3AED]/60 hover:border-[#7C3AED] text-[#7C3AED] dark:text-[#a78bfa] bg-transparent hover:bg-[#7C3AED]/10 hover:scale-[1.025] hover:shadow-sm",
    ghost: "bg-transparent hover:bg-slate-200/50 dark:hover:bg-[#111827]/40 text-slate-800 dark:text-zinc-200",
    danger: "bg-gradient-to-r from-red-500 via-rose-500 to-pink-650 hover:scale-[1.025] hover:brightness-95 text-white shadow-md shadow-red-500/15 border-0",
    link: "bg-transparent text-violet-600 dark:text-violet-400 hover:underline p-0 active:scale-100"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4.5 py-2.5 text-sm gap-2",
    lg: "px-6 py-3.5 text-base gap-2.5"
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {!loading && Icon && iconPosition === "left" && <Icon className="h-4 w-4" />}
      {children}
      {!loading && Icon && iconPosition === "right" && <Icon className="h-4 w-4" />}
    </button>
  );
});

Button.displayName = "Button";

export { Button };
