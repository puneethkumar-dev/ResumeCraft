import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Send } from "lucide-react";
import { useState } from "react";

const forgotPasswordSchema = zod.object({
  email: zod.string().min(1, "Email is required").email("Invalid email format")
});

export default function ForgotPasswordPage() {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setSuccess(true);
    } catch (err) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-left mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Reset password
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Enter your email and we'll send you a password reset link.
        </p>
      </div>

      {success ? (
        <div className="rounded-2xl bg-violet-50 dark:bg-violet-950/20 p-6 text-center border border-violet-100 dark:border-violet-900/50">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400 mb-4 animate-bounce">
            <Send className="h-5 w-5" />
          </div>
          <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-2">Check your email</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            We have sent a password reset link to your email address.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 text-sm font-semibold transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>
        </div>
      ) : (
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

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-700 active:scale-98 text-white px-4 py-2.5 text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none shadow-md shadow-violet-500/20 cursor-pointer"
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                Send reset link
                <Send className="h-4 w-4" />
              </>
            )}
          </button>

          <div className="text-center mt-4">
            <Link to="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
