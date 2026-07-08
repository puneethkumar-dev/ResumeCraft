import { cn } from "../../utils/cn";

export function Progress({
  value = 0,
  className,
  barClassName,
  showValue = false,
  size = "md",
  ...props
}) {
  const percentage = Math.min(100, Math.max(0, value));

  const height = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4"
  };

  return (
    <div className={cn("w-full text-left", className)} {...props}>
      {showValue && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Progress</span>
          <span className="text-xs font-bold text-violet-600 dark:text-violet-400">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={cn("w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden", height[size])}>
        <div
          className={cn("bg-violet-600 h-full rounded-full transition-all duration-500 ease-out", barClassName)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export function CircularProgress({
  value = 0,
  size = 120,
  strokeWidth = 10,
  className,
  textClassName,
  ...props
}) {
  const percentage = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  // Dynamically set color based on value
  const getStrokeColor = (val) => {
    if (val < 50) return "stroke-red-500 dark:stroke-red-400";
    if (val < 75) return "stroke-amber-500 dark:stroke-amber-400";
    return "stroke-emerald-500 dark:stroke-emerald-400";
  };

  const getBgColor = (val) => {
    if (val < 50) return "text-red-500/10 dark:text-red-400/5";
    if (val < 75) return "text-amber-500/10 dark:text-amber-400/5";
    return "text-emerald-500/10 dark:text-emerald-400/5";
  };

  return (
    <div className={cn("relative flex items-center justify-center", className)} {...props}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Track circle */}
        <circle
          className="text-slate-100 dark:text-slate-800"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress circle */}
        <circle
          className={cn("transition-all duration-500 ease-out", getStrokeColor(percentage))}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      {/* Centered Text */}
      <div className="absolute flex flex-col items-center">
        <span className={cn("font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white", textClassName)}>
          {Math.round(percentage)}
        </span>
        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Score</span>
      </div>
    </div>
  );
}
