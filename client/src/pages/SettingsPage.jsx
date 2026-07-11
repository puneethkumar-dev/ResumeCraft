import { useState, useEffect } from "react";
import { User, Settings, Lock, Sparkles, Bell, Save, CheckCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { useToast } from "../contexts/ToastContext";
import authApi from "../api/authApi";

export default function SettingsPage() {
  const [profile, setProfile] = useState(() => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : { name: "Puneeth Kumar", email: "puneeth@example.com" };
  });
  
  const [password, setPassword] = useState({ current: "", new: "", confirm: "" });
  const [notifications, setNotifications] = useState(true);
  const [aiAdvanced, setAiAdvanced] = useState(true);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [activeSection, setActiveSection] = useState("profile");

  useEffect(() => {
    const sections = ["profile-details", "password-security", "ai-preferences"];
    
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target.id === "profile-details") {
            setActiveSection("profile");
          } else if (entry.target.id === "password-security") {
            setActiveSection("security");
          } else if (entry.target.id === "ai-preferences") {
            setActiveSection("preferences");
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (id, sectionKey) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionKey);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authApi.updateProfile(profile.name, profile.email);
      if (response.success && response.data?.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setProfile(response.data.user);
        toast({
          variant: "success",
          title: "Profile Updated",
          description: response.message || "Your profile credentials have been saved in database."
        });
      } else {
        toast({
          variant: "danger",
          title: "Update Failed",
          description: response.message || "Failed to update profile details."
        });
      }
    } catch (err) {
      toast({
        variant: "danger",
        title: "Update Failed",
        description: err.response?.data?.message || "An error occurred while saving profile details."
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (password.new !== password.confirm) {
      toast({ variant: "danger", title: "Error", description: "Passwords do not match." });
      return;
    }
    setLoading(true);
    try {
      const response = await authApi.updatePassword(password.current, password.new);
      if (response.success) {
        setPassword({ current: "", new: "", confirm: "" });
        toast({
          variant: "success",
          title: "Password Changed",
          description: response.message || "Your security credentials have been updated."
        });
      } else {
        toast({
          variant: "danger",
          title: "Change Failed",
          description: response.message || "Failed to update password."
        });
      }
    } catch (err) {
      toast({
        variant: "danger",
        title: "Change Failed",
        description: err.response?.data?.message || "An error occurred while changing password."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 text-left max-w-4xl">
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Account Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal credentials, password, and AI optimization preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Side: Category Links */}
        <div className="space-y-2 md:col-span-1 md:sticky md:top-24 self-start">
          <div className="p-1 bg-slate-100 dark:bg-slate-900 rounded-xl space-y-1">
            <button 
              onClick={() => scrollToSection("profile-details", "profile")}
              className={`flex items-center gap-3 w-full px-4 py-2.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                activeSection === "profile"
                  ? "bg-white dark:bg-slate-800 text-violet-650 dark:text-white shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/40"
              }`}
            >
              <User className={`h-4 w-4 transition-colors ${activeSection === "profile" ? "text-violet-500" : "text-slate-400 dark:text-slate-500"}`} />
              Profile Details
            </button>
            <button 
              onClick={() => scrollToSection("password-security", "security")}
              className={`flex items-center gap-3 w-full px-4 py-2.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                activeSection === "security"
                  ? "bg-white dark:bg-slate-800 text-violet-650 dark:text-white shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/40"
              }`}
            >
              <Lock className={`h-4 w-4 transition-colors ${activeSection === "security" ? "text-violet-500" : "text-slate-400 dark:text-slate-500"}`} />
              Password & Security
            </button>
            <button 
              onClick={() => scrollToSection("ai-preferences", "preferences")}
              className={`flex items-center gap-3 w-full px-4 py-2.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                activeSection === "preferences"
                  ? "bg-white dark:bg-slate-800 text-violet-650 dark:text-white shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/40"
              }`}
            >
              <Sparkles className={`h-4 w-4 transition-colors ${activeSection === "preferences" ? "text-violet-500" : "text-slate-400 dark:text-slate-500"}`} />
              AI Preferences
            </button>
          </div>
        </div>

        {/* Right Side: Settings Forms */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Profile Form */}
          <Card id="profile-details" className="glass">
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
              <CardDescription>Update your email address and profile username details.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSave} className="space-y-4">
                <Input
                  label="Full Name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
                <Button
                  type="submit"
                  loading={loading}
                  icon={Save}
                  size="sm"
                  className="mt-2"
                >
                  Save Profile Settings
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Security Form */}
          <Card id="password-security" className="glass">
            <CardHeader>
              <CardTitle>Password & Security</CardTitle>
              <CardDescription>Keep your account secure with a strong password.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSave} className="space-y-4">
                <Input
                  label="Current Password"
                  type="password"
                  value={password.current}
                  onChange={(e) => setPassword({ ...password, current: e.target.value })}
                  placeholder="••••••••"
                />
                <Input
                  label="New Password"
                  type="password"
                  value={password.new}
                  onChange={(e) => setPassword({ ...password, new: e.target.value })}
                  placeholder="••••••••"
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  value={password.confirm}
                  onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                  placeholder="••••••••"
                />
                <Button
                  type="submit"
                  loading={loading}
                  icon={Save}
                  size="sm"
                  className="mt-2"
                >
                  Update Password
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card id="ai-preferences" className="glass">
            <CardHeader>
              <CardTitle>Advanced Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4.5">
              {/* Notification Toggles */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5 text-left">
                  <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">Email Notifications</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Receive alerts when new ATS features are launched.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="h-4.5 w-4.5 rounded border-slate-300 dark:border-slate-800 text-violet-650 focus:ring-violet-500 cursor-pointer"
                />
              </div>

              {/* AI Toggles */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/40">
                <div className="space-y-0.5 text-left">
                  <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">Advanced AI Engine (GPT-4)</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Optimize bullet points using deep context. Consumes more tokens.</p>
                </div>
                <input
                  type="checkbox"
                  checked={aiAdvanced}
                  onChange={(e) => setAiAdvanced(e.target.checked)}
                  className="h-4.5 w-4.5 rounded border-slate-300 dark:border-slate-800 text-violet-650 focus:ring-violet-500 cursor-pointer"
                />
              </div>
            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  );
}
