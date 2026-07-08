import { Outlet, Navigate, Link } from "react-router-dom";
import { Sparkles, FileText, CheckCircle2 } from "lucide-react";

export default function AuthLayout() {
  // Simple check for auth (if already logged in, redirect to dashboard)
  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950">
      {/* Form Section */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 text-white shadow-md shadow-violet-500/20 group-hover:scale-105 transition-transform duration-200">
                <FileText className="h-5 w-5" />
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-slate-950 dark:text-white">
                Resume<span className="text-violet-600 dark:text-violet-400">Craft</span>
              </span>
            </Link>
          </div>
          
          <Outlet />
        </div>
      </div>

      {/* Visual Marketing Panel */}
      <div className="relative hidden flex-1 items-center justify-center lg:flex bg-slate-900 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-violet-600/20 blur-[120px]"></div>
        <div className="absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full bg-indigo-600/20 blur-[120px]"></div>

        <div className="relative z-10 w-full max-w-md px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold text-violet-300 backdrop-blur-sm mb-6 animate-pulse-slow">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI-Powered Career Accelerator</span>
          </div>

          <h2 className="font-display text-4xl font-extrabold tracking-tight text-white leading-tight mb-4">
            Build a resume that lands <span className="bg-gradient-to-r from-violet-400 to-indigo-300 bg-clip-text text-transparent">3x more interviews</span>
          </h2>
          <p className="text-base text-slate-400 mb-10 leading-relaxed">
            Our AI-guided system optimizes your resume structure, refines bullet points, and checks ATS keywords instantly.
          </p>

          {/* Social Proof/Features List */}
          <div className="space-y-4 text-left glass-premium p-6 rounded-2xl border-white/5 dark:border-white/5 bg-slate-950/40">
            <div className="flex items-start gap-3">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-violet-400 mt-0.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
              <p className="text-sm font-medium text-slate-300">ATS Optimization Engine detects missing keywords</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-violet-400 mt-0.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
              <p className="text-sm font-medium text-slate-300">AI Bullet Point generator customizes for specific job roles</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-violet-400 mt-0.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
              <p className="text-sm font-medium text-slate-300">Beautiful, recruiter-vetted design templates</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
