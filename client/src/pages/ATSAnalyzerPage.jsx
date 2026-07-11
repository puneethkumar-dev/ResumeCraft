import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Sparkles, CheckSquare, AlertTriangle, CheckCircle, 
  HelpCircle, RefreshCw, FileText, ArrowRight, XCircle 
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Textarea } from "../components/ui/textarea";
import { Select } from "../components/ui/select";
import { CircularProgress } from "../components/ui/progress";
import { useToast } from "../contexts/ToastContext";
import { getResumeDisplayName } from "../utils/resume";

import resumeApi from "../api/resumeApi";
import aiApi from "../api/aiApi";

export default function ATSAnalyzerPage() {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [report, setReport] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await resumeApi.getAll();
        if (response.success && response.data) {
          const aligned = response.data.map(r => ({ ...r, id: r._id }));
          setResumes(aligned);
          if (aligned.length > 0) {
            setSelectedResumeId(aligned[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to load resumes:", err);
      }
    };
    fetchResumes();
  }, []);

  const handleJobDescriptionChange = (e) => {
    setJobDescription(e.target.value);
    if (validationError) {
      setValidationError(null);
      setErrorMessage("");
    }
  };

  const handleResumeChange = (e) => {
    setSelectedResumeId(e.target.value);
    if (validationError) {
      setValidationError(null);
      setErrorMessage("");
    }
  };

  const handleRunAnalysis = async () => {
    if (!selectedResumeId) {
      toast({ variant: "warning", title: "Select a Resume", description: "Choose a resume to analyze." });
      return;
    }
    if (jobDescription.trim().length < 100) {
      toast({ variant: "warning", title: "Job Description Too Short", description: "Job description must be at least 100 characters." });
      return;
    }

    setAnalyzing(true);
    setReport(null);
    setValidationError(null);
    setErrorMessage("");

    try {
      const response = await aiApi.atsAnalyze(selectedResumeId, jobDescription);
      
      if (response.success && response.data) {
        const result = response.data;
        if (result.status === 'incomplete_resume' || result.status === 'invalid_job_description') {
          setValidationError(result.status);
          setErrorMessage(result.message);
          toast({ 
            variant: "warning", 
            title: result.status === 'incomplete_resume' ? "Incomplete Resume" : "Invalid Job Description", 
            description: result.message 
          });
        } else {
          setReport(result);
          toast({
            variant: "success",
            title: "Scan Completed",
            description: `ATS Match Score: ${result.overallScore}%`
          });
        }
      } else {
        toast({
          variant: "danger",
          title: "Scan Failed",
          description: response.message || "Could not complete the ATS comparison."
        });
      }
    } catch (err) {
      console.error("ATS scan error:", err);
      toast({
        variant: "danger",
        title: "Scan Failed",
        description: err.response?.data?.message || "Could not connect to the analysis service."
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const isButtonDisabled = !selectedResumeId || jobDescription.trim().length < 100;

  return (
    <div className="space-y-8 text-left">
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          ATS Keyword & Scanner Analyzer
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Scan your experience listings against targeted job descriptions to identify keywords and formatting gaps.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form Scans */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>Select a resume profile and provide the target job posting description.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <Select
                label="Select Resume"
                value={selectedResumeId}
                onChange={handleResumeChange}
                placeholder="Choose a profile..."
              >
                {resumes.map(r => (
                  <option key={r.id} value={r.id}>{getResumeDisplayName(r)}</option>
                ))}
              </Select>

              <div className="space-y-1">
                <Textarea
                  label="Target Job Description"
                  placeholder="Paste the full job responsibilities, skills, and qualifications from the hiring listing (minimum 100 characters)..."
                  value={jobDescription}
                  onChange={handleJobDescriptionChange}
                  rows={9}
                />
                <p className="text-[10px] text-slate-400 text-right font-medium">
                  {jobDescription.trim().length} / 100 characters minimum
                </p>
              </div>

              <Button
                onClick={handleRunAnalysis}
                loading={analyzing}
                disabled={isButtonDisabled}
                icon={RefreshCw}
                className="w-full shadow-md shadow-violet-500/10"
              >
                Scan Match Score
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Scan Report Dashboard */}
        <div className="lg:col-span-7">
          {validationError ? (
            <Card className="border-amber-200 dark:border-amber-800/60 bg-amber-500/5 p-8 text-center rounded-2xl animate-fade-in text-left">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950/30 text-amber-550 mb-4">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-2 text-center">
                {validationError === 'incomplete_resume' ? "Incomplete Resume Profile" : "Invalid Job Description"}
              </h3>
              <p className="text-sm text-slate-650 dark:text-slate-400 max-w-md mx-auto leading-relaxed text-center">
                {errorMessage || "Please review your inputs and try again."}
              </p>
              {validationError === 'incomplete_resume' && (
                <div className="mt-6 flex justify-center">
                  <Link to={`/builder/${selectedResumeId}`}>
                    <Button size="sm" icon={ArrowRight} iconPosition="right">Go to Resume Builder</Button>
                  </Link>
                </div>
              )}
            </Card>
          ) : report ? (
            <div className="space-y-6 animate-fade-in">
              <Card className="glass-premium">
                <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="space-y-3 text-center sm:text-left flex-1">
                    <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                      ATS compatibility score
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal max-w-sm">
                      {report.overallScore >= 80 
                        ? "Excellent match! Your resume contains the core keywords and formatting to clear automated screening phases." 
                        : report.overallScore >= 60 
                          ? "Fair alignment. We recommend adding a few missing keywords to raise your compatibility metrics."
                          : "High risk of automated rejection. Key qualifications from the job posting are missing from your resume."
                      }
                    </p>
                  </div>
                  
                  <div className="shrink-0">
                    <CircularProgress value={report.overallScore} size={120} strokeWidth={10} />
                  </div>
                </CardContent>
              </Card>

              {/* Keyword grids */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Matched */}
                <Card className="border-slate-200 dark:border-slate-800">
                  <CardHeader className="pb-3.5 border-b border-slate-100 dark:border-slate-800/40">
                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4" />
                      Matched Keywords ({report.matchedKeywords?.length || 0})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex flex-wrap gap-1.5">
                      {report.matchedKeywords && report.matchedKeywords.length > 0 ? (
                        report.matchedKeywords.map(kw => (
                          <Badge key={kw} variant="success" className="text-[10px] uppercase font-bold py-1">
                            {kw}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400">None detected</span>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Missing */}
                <Card className="border-slate-200 dark:border-slate-800">
                  <CardHeader className="pb-3.5 border-b border-slate-100 dark:border-slate-800/40">
                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center gap-1.5">
                      <XCircle className="h-4 w-4" />
                      Missing Keywords ({report.missingKeywords?.length || 0})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex flex-wrap gap-1.5">
                      {report.missingKeywords && report.missingKeywords.length > 0 ? (
                        report.missingKeywords.map(kw => (
                          <Badge key={kw} variant="danger" className="text-[10px] uppercase font-bold py-1">
                            {kw}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400">None detected</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Skills matching grids */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Matched Skills */}
                <Card className="border-slate-200 dark:border-slate-800">
                  <CardHeader className="pb-3.5 border-b border-slate-100 dark:border-slate-800/40">
                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4" />
                      Matched Skills ({report.matchedSkills?.length || 0})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex flex-wrap gap-1.5">
                      {report.matchedSkills && report.matchedSkills.length > 0 ? (
                        report.matchedSkills.map(sk => (
                          <Badge key={sk} variant="outline" className="text-[10px] uppercase font-bold py-1 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5">
                            {sk}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400">None detected</span>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Missing Skills */}
                <Card className="border-slate-200 dark:border-slate-800">
                  <CardHeader className="pb-3.5 border-b border-slate-100 dark:border-slate-800/40">
                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center gap-1.5">
                      <XCircle className="h-4 w-4" />
                      Missing Skills ({report.missingSkills?.length || 0})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex flex-wrap gap-1.5">
                      {report.missingSkills && report.missingSkills.length > 0 ? (
                        report.missingSkills.map(sk => (
                          <Badge key={sk} variant="outline" className="text-[10px] uppercase font-bold py-1 border-red-500/20 text-red-650 dark:text-red-400 bg-red-500/5">
                            {sk}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400">None detected</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Health Diagnostics list */}
              <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Health Diagnostics Check</CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-0 space-y-3">
                  {report.diagnostics && report.diagnostics.length > 0 ? (
                    report.diagnostics.map((diag, i) => {
                      const isSuccess = diag.startsWith('✓');
                      return (
                        <div key={i} className="flex items-start gap-3 text-xs leading-relaxed text-slate-650 dark:text-slate-350">
                          {isSuccess ? (
                            <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                          ) : (
                            <XCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
                          )}
                          <span>{diag.replace(/^[✓✗]\s*/, '')}</span>
                        </div>
                      );
                    })
                  ) : (
                    <span className="text-xs text-slate-400">None generated</span>
                  )}
                </CardContent>
              </Card>

              {/* Suggestions */}
              <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Actionable Improvements</CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-0 space-y-3">
                  {report.recommendations && report.recommendations.length > 0 ? (
                    report.recommendations.map((rec, i) => (
                      <div key={i} className="flex items-start gap-3 text-xs leading-relaxed text-slate-650 dark:text-slate-350 bg-slate-50 dark:bg-slate-900/30 p-3 rounded-xl">
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400 font-bold text-[10px]">
                          {i + 1}
                        </div>
                        <span>{rec}</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">No suggestions available</span>
                  )}
                </CardContent>
              </Card>

            </div>
          ) : (
            <Card className="h-full flex flex-col items-center justify-center text-center p-12 border-dashed min-h-[350px]">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mb-4 animate-pulse-slow">
                <CheckSquare className="h-6 w-6" />
              </div>
              <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-2">No scan report generated</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                Provide a job details listing and click Scan Match Score to evaluate keyword rankings.
              </p>
            </Card>
          )}
        </div>

      </div>
    </div>
  );
}
