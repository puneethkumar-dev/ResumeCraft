import { Link } from "react-router-dom";
import { FileQuestion, ArrowLeft, Home } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-6 py-12 text-center overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/10 blur-[100px]"></div>

      <div className="relative z-10 flex flex-col items-center max-w-md">
        {/* Animated Icon Container */}
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-tr from-violet-600 to-indigo-500 text-white shadow-xl shadow-violet-500/20 mb-8 animate-float">
          <FileQuestion className="h-12 w-12" />
        </div>

        <h1 className="font-display text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
          404
        </h1>
        
        <h2 className="font-display text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">
          Page Not Found
        </h2>
        
        <p className="text-base text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
          Oops! The page you are looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 px-5 py-2.5 text-sm font-semibold transition-colors duration-200"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>
          <Link
            to="/dashboard"
            className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 text-sm font-semibold shadow-md shadow-violet-500/20 transition-all duration-200 active:scale-98"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
