import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";
import { useState } from "react";
import authApi from "../../api/authApi";

const loginSchema = zod.object({
  email: zod.string().min(1, "Email is required").email("Invalid email format"),
  password: zod.string().min(6, "Password must be at least 6 characters")
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    try {
      const response = await authApi.login(data.email, data.password);
      if (response.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/dashboard");
      } else {
        setError(response.message || "Invalid email or password");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-left mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Welcome back
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          New to ResumeCraft?{" "}
          <Link to="/register" className="font-semibold text-violet-600 dark:text-violet-400 hover:underline">
            Create an account
          </Link>
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 dark:bg-red-950/30 p-4 text-xs font-semibold text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Email address
          </label>
          <div className="relative rounded-xl shadow-xs">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <Mail className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="email"
              {...register("email")}
              className={`block w-full rounded-xl border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-800 focus:ring-violet-500'} bg-white dark:bg-slate-900 py-2.5 pl-10 pr-4 text-sm outline-hidden focus:ring-2 focus:border-transparent dark:text-white`}
              placeholder="you@example.com"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Password
            </label>
            <Link to="/forgot-password" className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative rounded-xl shadow-xs">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <Lock className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              className={`block w-full rounded-xl border ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-800 focus:ring-violet-500'} bg-white dark:bg-slate-900 py-2.5 pl-10 pr-10 text-sm outline-hidden focus:ring-2 focus:border-transparent dark:text-white`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-700 active:scale-98 text-white px-4 py-2.5 text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none shadow-md shadow-violet-500/20 cursor-pointer"
        >
          {loading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <>
              Sign In
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
