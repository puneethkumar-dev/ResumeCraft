import { useState, useEffect, useRef } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { 
  FileText, LayoutDashboard, Settings, User, 
  Sparkles, Compass, CheckSquare, LogOut, Menu, X, Sun, Moon, Bell, HelpCircle
} from "lucide-react";
import { cn } from "../utils/cn";
import authApi from "../api/authApi";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Resume Builder", icon: FileText, path: "/builder" },
  { label: "ATS Analyzer", icon: CheckSquare, path: "/ats" },
  { label: "Templates", icon: Compass, path: "/templates" },
  { label: "Settings", icon: Settings, path: "/settings" }
];

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark" || 
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem("user");
    return cached ? JSON.parse(cached) : { name: "User", email: "" };
  });
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // Redirect to login if token is missing
  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [token, navigate]);

  // Dark Mode side effects
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Fetch dynamic user profile details
  useEffect(() => {
    if (!token) return;
    const fetchUserProfile = async () => {
      try {
        const response = await authApi.getProfile();
        if (response.success && response.data && response.data.user) {
          setUser(response.data.user);
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }
      } catch (err) {
        console.error("Failed to load user profile:", err);
      }
    };
    fetchUserProfile();
  }, [token]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    navigate("/logout");
  };

  if (!token) return null;

  const currentUser = user;

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 transition-colors duration-200">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-30">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-6 mb-8 gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 text-white shadow-md shadow-violet-500/20">
              <FileText className="h-5 w-5" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight text-slate-950 dark:text-white">
              Resume<span className="text-violet-600 dark:text-violet-400">Craft</span>
            </span>
          </div>

          <nav className="flex-1 px-3 space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group gap-3",
                    isActive 
                      ? "bg-violet-600 text-white shadow-md shadow-violet-500/20"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white"
                  )}
                >
                  <Icon className={cn(
                    "h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110",
                    isActive ? "text-white" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                  )} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="px-3 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-1">
            <button
              onClick={handleLogout}
              className="flex w-full items-center px-4 py-3 text-sm font-medium rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200 gap-3 group"
            >
              <LogOut className="h-4 w-4 shrink-0 text-red-500 group-hover:translate-x-1 transition-transform" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Sidebar - Mobile Drawer */}
      <div className={cn(
        "fixed inset-0 z-50 flex md:hidden transition-opacity duration-300",
        sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}>
        {/* Backdrop */}
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}></div>
        
        {/* Drawer content */}
        <div className={cn(
          "relative flex flex-col w-full max-w-xs flex-1 bg-white dark:bg-slate-900 pt-5 pb-4 transition-transform duration-300 ease-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white bg-slate-800 text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex items-center flex-shrink-0 px-6 mb-8 gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 text-white shadow-md">
              <FileText className="h-5 w-5" />
            </div>
            <span className="font-display text-lg font-bold text-slate-950 dark:text-white">
              Resume<span className="text-violet-600 dark:text-violet-400">Craft</span>
            </span>
          </div>

          <nav className="flex-1 px-3 space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-xl gap-3",
                    isActive 
                      ? "bg-violet-600 text-white" 
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="px-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={handleLogout}
              className="flex w-full items-center px-4 py-3 text-sm font-medium rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 gap-3"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 md:pl-64 min-w-0">
        
        {/* Top Header */}
        <header className="sticky top-0 z-20 flex h-16 shrink-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 justify-between items-center">
          
          {/* Mobile hamburger menu */}
          <button
            type="button"
            className="md:hidden flex h-10 w-10 items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Desktop welcome info */}
          <div className="hidden sm:block">
            <h1 className="text-base font-semibold text-slate-800 dark:text-slate-100">
              Welcome back, <span className="text-violet-600 dark:text-violet-400 font-bold">{currentUser.name}</span>
            </h1>
          </div>

          {/* Right Header actions */}
          <div className="flex items-center gap-3 ml-auto sm:ml-0">
            {/* Dark mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-500 dark:text-slate-400 transition-colors"
              title="Toggle theme"
            >
              {darkMode ? <Sun className="h-4.5 w-4.5 text-yellow-500" /> : <Moon className="h-4.5 w-4.5 text-indigo-500" />}
            </button>

            {/* Notification Badge */}
            <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-500 dark:text-slate-400">
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-violet-600 ring-2 ring-white dark:ring-slate-900"></span>
            </button>

             {/* Profile Details & Logout Button */}
            <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-800 pl-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 text-white flex items-center justify-center font-bold text-xs uppercase shadow">
                {(currentUser?.name || "US").substring(0, 2)}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{currentUser.name}</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate max-w-[120px]">{currentUser.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-red-500/10 text-red-500 hover:text-red-600 transition-colors ml-1 cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Content Container */}
        <main className="flex-1 overflow-y-auto py-8 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
