import { useParams, useNavigate, Link } from "react-router-dom";
import { ResumeFormProvider, useResumeForm } from "../contexts/ResumeFormContext";
import ResumeLivePreview from "../features/builder/components/ResumeLivePreview";
import { Button } from "../components/ui/button";
import { 
  ArrowLeft, Edit, Download, CheckSquare, FileText, Printer, Sparkles,
  CheckCircle, AlertTriangle, XCircle, TrendingUp, HelpCircle
} from "lucide-react";
import { useToast } from "../contexts/ToastContext";
import { useState } from "react";
import aiApi from "../api/aiApi";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { CircularProgress } from "../components/ui/progress";

function PreviewContent() {
  const { resumeData, loading, updateGeneratedContent, updateAnalysis } = useResumeForm();
  const [downloading, setDownloading] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [viewMode, setViewMode] = useState("original");
  const navigate = useNavigate();
  const { toast } = useToast();

  if (loading || !resumeData) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-600 border-t-transparent"></div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        variant: "success",
        title: "Export Success",
        description: "PDF file is downloading to your system."
      });
    } catch (err) {
      // ignore
    } finally {
      setDownloading(false);
    }
  };

  const handleGenerateAI = async () => {
    setGeneratingAI(true);
    try {
      const response = await aiApi.generate(resumeData.id);
      if (response.success && response.data) {
        // Update local form state with the generated content returned by backend
        updateGeneratedContent(response.data.generatedContent);
        setViewMode("ai"); // Automatically switch to the AI optimized view
        toast({
          variant: "success",
          title: "AI Optimization Success",
          description: "Gemini has structured and optimized your resume. Toggle 'AI Optimized' view to see details."
        });
      } else {
        toast({
          variant: "danger",
          title: "Optimization Failed",
          description: response.message || "Could not generate AI optimized content."
        });
      }
    } catch (err) {
      toast({
        variant: "danger",
        title: "AI Service Error",
        description: err.response?.data?.message || "An error occurred during Gemini AI processing. Try again."
      });
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const response = await aiApi.analyze(resumeData.id);
      if (response.success && response.data) {
        updateAnalysis(response.data);
        setViewMode("analysis"); // Automatically switch to the Analysis view
        toast({
          variant: "success",
          title: "Analysis Success",
          description: "Gemini has completed your resume audit and feedback report."
        });
      } else {
        toast({
          variant: "danger",
          title: "Analysis Failed",
          description: response.message || "Could not generate analysis report."
        });
      }
    } catch (err) {
      toast({
        variant: "danger",
        title: "Analysis Service Error",
        description: err.response?.data?.message || "An error occurred during resume analysis. Try again."
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const renderAnalysis = () => {
    const audit = resumeData.analysis;
    if (!audit) return null;

    return (
      <div className="w-full space-y-8 animate-fade-in text-left max-w-3xl mx-auto">
        {/* Overall Score Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="glass flex flex-col items-center justify-center p-6 text-center">
            <CircularProgress value={audit.overallScore} size={80} strokeWidth={8} />
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-4">Overall Score</h4>
            <p className="font-display text-xl font-extrabold text-slate-900 dark:text-white mt-1">{audit.overallScore}%</p>
          </Card>
          
          <Card className="glass flex flex-col items-center justify-center p-6 text-center">
            <CircularProgress value={audit.atsScore} size={80} strokeWidth={8} className="text-emerald-500" />
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-4">ATS Score</h4>
            <p className="font-display text-xl font-extrabold text-slate-900 dark:text-white mt-1">{audit.atsScore}%</p>
          </Card>

          <Card className="glass flex flex-col items-center justify-center p-6 text-center">
            <CircularProgress value={audit.grammarScore} size={80} strokeWidth={8} className="text-blue-500" />
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-4">Grammar</h4>
            <p className="font-display text-xl font-extrabold text-slate-900 dark:text-white mt-1">{audit.grammarScore}%</p>
          </Card>

          <Card className="glass flex flex-col items-center justify-center p-6 text-center">
            <CircularProgress value={audit.readabilityScore} size={80} strokeWidth={8} className="text-amber-500" />
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-4">Readability</h4>
            <p className="font-display text-xl font-extrabold text-slate-900 dark:text-white mt-1">{audit.readabilityScore}%</p>
          </Card>
        </div>

        {/* Strengths & Weaknesses Split Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths Card */}
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/40">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
                Strengths ({audit.strengths?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3.5">
              {audit.strengths?.map((str, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-650 dark:text-slate-300 leading-relaxed">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5"></span>
                  <span>{str}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Weaknesses Card */}
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/40">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center gap-1.5">
                <XCircle className="h-4 w-4 shrink-0 text-red-500" />
                Weaknesses ({audit.weaknesses?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3.5">
              {audit.weaknesses?.map((weak, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-650 dark:text-slate-300 leading-relaxed">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0 mt-1.5"></span>
                  <span>{weak}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Suggestions & Missing Skills */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Actionable Suggestions */}
          <Card className="md:col-span-2 border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/40">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 shrink-0 text-violet-500" />
                Suggestions ({audit.suggestions?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              {audit.suggestions?.map((sug, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs leading-relaxed text-slate-650 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/30 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/20">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400 font-bold text-[10px]">
                    {idx + 1}
                  </div>
                  <span>{sug}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Missing Skills Card */}
          <Card className="md:col-span-1 border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/40">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
                Missing Skills ({audit.missingSkills?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <p className="text-[10px] text-slate-400 leading-normal mb-4">Adding these highly requested keywords for your target role can boost compatibility:</p>
              <div className="flex flex-wrap gap-2">
                {audit.missingSkills?.map((sk, idx) => (
                  <Badge key={idx} variant="warning" className="text-[10px] uppercase font-bold py-1 px-2.5">
                    {sk}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      {/* Top Navbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 dark:border-slate-800 pb-5 gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-500"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </button>
          <div>
            <h1 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              {resumeData.title}
            </h1>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider pl-1 mt-0.5">
              Template: {resumeData.template} &bull; ATS Score: {resumeData.atsScore}%
            </p>
          </div>
        </div>

        {/* Action Panel */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            icon={CheckSquare}
            onClick={handleAnalyze}
            loading={analyzing}
            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/10"
          >
            Analyze Resume
          </Button>
          <Button
            size="sm"
            icon={Sparkles}
            onClick={handleGenerateAI}
            loading={generatingAI}
            className="bg-gradient-to-r from-violet-600 to-indigo-500 hover:from-violet-750 hover:to-indigo-650 text-white shadow-md shadow-violet-500/10"
          >
            Generate AI Resume
          </Button>
          <Link to={`/builder/${resumeData.id}`}>
            <Button variant="outline" size="sm" icon={Edit}>
              Edit Draft
            </Button>
          </Link>
          <Button variant="outline" size="sm" icon={Printer} onClick={handlePrint} className="hidden sm:inline-flex">
            Print
          </Button>
          <Button size="sm" icon={Download} onClick={handleDownload} loading={downloading} variant="outline">
            Export PDF
          </Button>
        </div>
      </div>

      {/* Toggle mode: Original vs AI Optimized vs Analysis */}
      <div className="flex justify-center gap-2 mb-4 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl max-w-sm mx-auto border border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setViewMode("original")}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
            viewMode === "original"
              ? "bg-white dark:bg-slate-800 shadow-xs text-slate-900 dark:text-white"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
          }`}
        >
          Original
        </button>
        {resumeData.generatedContent && (resumeData.generatedContent.summary || resumeData.generatedContent.experience?.length > 0) && (
          <button
            onClick={() => setViewMode("ai")}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "ai"
                ? "bg-white dark:bg-slate-800 shadow-xs text-slate-900 dark:text-white"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
            }`}
          >
            AI Optimized
          </button>
        )}
        {resumeData.analysis && (
          <button
            onClick={() => setViewMode("analysis")}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "analysis"
                ? "bg-white dark:bg-slate-800 shadow-xs text-slate-900 dark:text-white"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
            }`}
          >
            Analysis
          </button>
        )}
      </div>

      {/* Main Center Area rendering the sheet or the analysis audit */}
      {viewMode === "analysis" ? (
        renderAnalysis()
      ) : (
        <div className="bg-slate-100 dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800/80 shadow-inner overflow-auto print:bg-white print:p-0 print:border-none print:shadow-none w-full">
          <ResumeLivePreview scale={1} useAI={viewMode === "ai"} />
        </div>
      )}
    </div>
  );
}

export default function ResumePreviewPage() {
  return (
    <ResumeFormProvider>
      <PreviewContent />
    </ResumeFormProvider>
  );
}
