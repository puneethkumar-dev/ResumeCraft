import { Outlet, Navigate, Link } from "react-router-dom";
import { Sparkles, FileText, CheckCircle2 } from "lucide-react";
import RobotIllustration from "../components/RobotIllustration";

export default function AuthLayout() {
  // Simple check for auth (if already logged in, redirect to dashboard)
  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen w-full bg-white dark:bg-slate-950">
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

      {/* Visual Marketing Panel — light theme matching landing page */}
      <div className="relative hidden flex-1 items-center justify-center lg:flex overflow-hidden"
        style={{ background: "linear-gradient(135deg, #faf5ff 0%, #f0f9ff 50%, #fafafe 100%)" }}
      >
        {/* Soft pastel ambient glows (matching landing page) */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 60% at 30% 50%, rgba(196,181,253,0.18) 0%, transparent 70%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 80% 30%, rgba(186,230,253,0.15) 0%, transparent 70%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 50% 40% at 60% 85%, rgba(167,139,250,0.10) 0%, transparent 70%)" }} />

        <div className="relative z-10 w-full max-w-md px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/50 bg-white/70 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-violet-600 mb-6 shadow-sm shadow-violet-100">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI-Powered Career Accelerator</span>
          </div>

          {/* Headline */}
          <h2 className="font-display text-4xl font-extrabold tracking-tight leading-tight mb-4" style={{ color: "#1e293b" }}>
            Build a resume that lands{" "}
            <span style={{ background: "linear-gradient(135deg, #7c3aed, #38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              3x more interviews
            </span>
          </h2>

          <p className="text-base mb-10 leading-relaxed" style={{ color: "#64748b" }}>
            Our AI-guided system optimizes your resume structure, refines bullet points, and checks ATS keywords instantly.
          </p>

          {/* Robot illustration — unchanged */}
          <RobotIllustration />

          {/* Feature list — light card matching landing page */}
          <div
            className="space-y-4 text-left p-6 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.75)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(124,58,237,0.10)",
              boxShadow: "0 8px 32px rgba(124,58,237,0.07)",
            }}
          >
            {[
              "ATS Optimization Engine detects missing keywords",
              "AI Bullet Point generator customizes for specific job roles",
              "Beautiful, recruiter-vetted design templates",
            ].map((feat) => (
              <div key={feat} className="flex items-start gap-3">
                <div
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full mt-0.5"
                  style={{ background: "linear-gradient(135deg, #ede9fe, #dbeafe)" }}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" style={{ color: "#7c3aed" }} />
                </div>
                <p className="text-sm font-medium" style={{ color: "#334155" }}>{feat}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
