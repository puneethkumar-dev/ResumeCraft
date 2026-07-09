import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { motion } from "framer-motion";

export default function LogoutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear credentials
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect to landing page after 1.5 seconds
    const timer = setTimeout(() => {
      navigate("/", { replace: true });
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-sm w-full text-center space-y-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-xl"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-500 animate-pulse-slow">
          <LogOut className="h-6 w-6" />
        </div>
        
        <div className="space-y-2">
          <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
            Signing out
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Clearing your secure workspace session...
          </p>
        </div>

        <div className="flex justify-center pt-2">
          <div className="h-5 w-5 animate-spin rounded-full border-3 border-violet-600 border-t-transparent"></div>
        </div>
      </motion.div>
    </div>
  );
}
