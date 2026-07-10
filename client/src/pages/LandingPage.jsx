import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, FileText, ChevronRight, CheckCircle2, Star, 
  ArrowRight, ShieldCheck, Cpu, Zap, Download, HelpCircle, 
  Menu, X 
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import LandingBackground from "../components/LandingBackground";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Enhancements",
    description: "Instantly draft professional summaries, rewrite weak bullet points, and adjust tone with built-in AI assistant."
  },
  {
    icon: Cpu,
    title: "Real-time ATS Keyword Matching",
    description: "Scan your resume against target job descriptions and close keyword gaps immediately before submitting."
  },
  {
    icon: FileText,
    title: "Recruiter-Approved Templates",
    description: "Choose from minimalist, modern, or executive templates designed according to industry standards."
  },
  {
    icon: Zap,
    title: "Live Interactive Editor",
    description: "Watch your changes render in real-time in a side-by-side recruiter-ready PDF preview panel."
  },
  {
    icon: Download,
    title: "Instant Clean Export",
    description: "Download in ATS-parsable PDF formats without page overflows, alignment bugs, or margin issues."
  },
  {
    icon: ShieldCheck,
    title: "Privacy Focused",
    description: "Your data is entirely yours. We do not sell or train external models on your private credentials."
  }
];

const steps = [
  { number: "01", title: "Select a Template", desc: "Choose from our library of recruiter-tested templates." },
  { number: "02", title: "Fill details & AI Assist", desc: "Input your history and let the AI polish your bullet points." },
  { number: "03", title: "Scan against ATS", desc: "Paste the job description and match key terms instantly." },
  { number: "04", title: "Download PDF", desc: "Export in clean, high-scoring ATS formats." }
];

const faqs = [
  {
    question: "Is this resume builder really ATS-friendly?",
    answer: "Yes, absolutely! All templates are structured using clean HTML-to-PDF converters that produce machine-readable PDF layers. They do not contain invisible tables, graphics, or text box columns that confuse ATS parsers."
  },
  {
    question: "How does the AI assistant improve my resume?",
    answer: "Our AI assistant uses standard action-oriented phrasing rules (e.g. Google's X-Y-Z formula) to rewrite passive descriptions into high-impact, metric-driven achievements tailored for your target job title."
  },
  {
    question: "Can I customize the sections on the template?",
    answer: "Yes! You can dynamically hide, rename, or reorder sections (like Projects, Certifications, Languages, custom blocks) at any time to match your unique background."
  },
  {
    question: "Is there a limit on exports?",
    answer: "Under our free tier, you can create and export up to two resumes. Our Premium tier unlocks unlimited documents, cover letter generators, and recursive ATS scans."
  }
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [promptText, setPromptText] = useState("");
  const navigate = useNavigate();

  const handlePromptSubmit = (e) => {
    e.preventDefault();
    if (!promptText.trim()) return;
    localStorage.setItem("initial_ai_prompt", promptText.trim());
    navigate("/register");
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 scroll-smooth overflow-x-hidden relative">
      <LandingBackground />
      
      {/* Header/Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 text-white shadow-md">
                <FileText className="h-5 w-5" />
              </div>
              <span className="font-display text-lg font-bold text-slate-950 dark:text-white">
                Resume<span className="text-violet-600 dark:text-violet-400">Craft</span>
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">How it Works</a>
              <a href="#faq" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">FAQ</a>
            </nav>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button size="sm" icon={ArrowRight} iconPosition="right">Get Started</Button>
              </Link>
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 space-y-3"
            >
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-slate-600 dark:text-slate-400 py-1.5">Features</a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-slate-600 dark:text-slate-400 py-1.5">How it Works</a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-slate-600 dark:text-slate-400 py-1.5">FAQ</a>
              <div className="h-px bg-slate-100 dark:bg-slate-800 my-2"></div>
              <div className="flex flex-col gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Sign In</Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 md:pt-28 md:pb-32 bg-grid-pattern overflow-hidden bg-transparent">
        {/* Colorful Gradient Blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[450px] rounded-full bg-violet-600/10 dark:bg-violet-600/5 blur-[120px] pointer-events-none"></div>
        <div className="absolute top-10 right-20 h-[300px] w-[300px] rounded-full bg-indigo-600/10 dark:bg-indigo-600/5 blur-[100px] pointer-events-none"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center justify-center text-center">
          <div className="max-w-3xl flex flex-col items-center text-center space-y-6">
            <Badge variant="secondary" className="bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 border border-violet-100 dark:border-violet-850/40 py-1 px-3 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 animate-pulse-slow">
              <Sparkles className="h-3.5 w-3.5" />
              Professional Resume Builder
            </Badge>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] w-full">
              Craft <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-500 bg-clip-text text-transparent">Professional</span> Resumes
            </h1>

            <p className="text-base sm:text-lg text-slate-550 dark:text-slate-400 leading-relaxed max-w-xl mx-auto">
              Create job-winning resumes with expertly designed templates, ATS-friendly, recruiter-approved, and tailored to your career goals.
            </p>

            {/* Middle Prompt Input Box */}
            <div className="w-full max-w-xl mx-auto">
              <form onSubmit={handlePromptSubmit} className="relative flex items-center p-1.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus-within:ring-2 focus-within:ring-violet-500 focus-within:border-transparent transition-all duration-200 shadow-xs">
                <div className="flex items-center pl-3.5 pr-2 pointer-events-none text-slate-400 dark:text-slate-500">
                  <Sparkles className="h-4.5 w-4.5" />
                </div>
                <input
                  type="text"
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="e.g., Senior React Developer with 5 years experience..."
                  className="w-full bg-transparent py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 active:scale-98 text-white text-sm font-semibold transition-all shadow-md shadow-violet-500/20 cursor-pointer shrink-0"
                >
                  <span>Generate</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>

            {/* Sub-CTA buttons */}
            <div className="flex flex-wrap gap-4 items-center justify-center pt-2">
              <Link to="/register">
                <Button size="lg" className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-white font-semibold flex items-center gap-2 cursor-pointer shadow-md shadow-slate-950/10 dark:shadow-white/5">
                  Start Building
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/templates">
                <Button variant="outline" size="lg" className="border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-355 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer">
                  View Templates
                </Button>
              </Link>
            </div>

            {/* Stats Counters */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200/60 dark:border-slate-800/40 w-full max-w-md mx-auto">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-display">50K+</div>
                <div className="text-[11px] text-slate-450 dark:text-slate-500 font-semibold tracking-wide uppercase mt-1">Resumes Created</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-display flex items-center gap-1 justify-center">
                  4.9
                  <Star className="h-4.5 w-4.5 fill-amber-400 stroke-amber-400 mb-0.5" />
                </div>
                <div className="text-[11px] text-slate-450 dark:text-slate-500 font-semibold tracking-wide uppercase mt-1">User Rating</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-display">5 Min</div>
                <div className="text-[11px] text-slate-450 dark:text-slate-500 font-semibold tracking-wide uppercase mt-1">Build Time</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-20 md:py-28 bg-transparent relative border-t border-b border-slate-200/50 dark:border-slate-800/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
              Equipped with elite features to supercharge your resume
            </h2>
            <p className="text-base text-slate-500 dark:text-slate-400">
              Say goodbye to messy styling margins and writer's block. Let the builder handle the hard work.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, index) => {
              const Icon = feat.icon;
              return (
                <Card key={index} className="hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400 mb-5 group-hover:scale-110 transition-transform">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-display font-bold text-slate-900 dark:text-white mb-2">{feat.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{feat.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 md:py-28 bg-transparent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
              How ResumeCraft works
            </h2>
            <p className="text-base text-slate-500 dark:text-slate-400">
              Four easy steps to a perfectly formatted, ATS-vetted, high-impact career resume.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col text-left group">
                <span className="font-display text-5xl font-black text-violet-600/10 group-hover:text-violet-600/20 dark:text-violet-400/5 dark:group-hover:text-violet-400/10 transition-colors leading-none mb-3">
                  {step.number}
                </span>
                <h3 className="font-display font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="py-20 md:py-28 bg-transparent border-t border-slate-200/50 dark:border-slate-800/40">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-base text-slate-500 dark:text-slate-400">
              Everything you need to know about the builder, ATS, and our capabilities.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50/50 dark:bg-slate-900/20">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="flex w-full items-center justify-between px-6 py-4.5 text-left font-semibold text-slate-900 dark:text-white transition-colors"
                  >
                    <span className="text-sm font-semibold">{faq.question}</span>
                    <HelpCircle className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-violet-500' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="px-6 pb-5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed"
                      >
                        {faq.answer}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 md:py-24 bg-gradient-to-tr from-violet-900 via-indigo-950 to-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-violet-500/20 blur-[120px] pointer-events-none"></div>

        <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center relative z-10">
          <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4">
            Are you ready to land your dream job?
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto mb-8 text-sm md:text-base leading-relaxed">
            Create an account in less than 30 seconds. Start optimizing your resume metrics and climb to the top of recruiter pipelines today.
          </p>
          <Link to="/register">
            <Button size="lg" variant="primary" className="bg-white hover:bg-slate-100 text-slate-900 shadow-xl cursor-pointer">
              Get Started for Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white">
              <FileText className="h-4.5 w-4.5" />
            </div>
            <span className="font-display text-base font-bold text-white">
              ResumeCraft
            </span>
          </div>

          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} ResumeCraft. All rights reserved. Designed for elite developers and industry leaders.
          </p>

          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white transition-colors" title="Twitter">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
              </svg>
            </a>
            <a href="#" className="hover:text-white transition-colors" title="LinkedIn">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            <a href="#" className="hover:text-white transition-colors" title="GitHub">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
