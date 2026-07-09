import { useState, useEffect } from "react";
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

const RESUMES_KEY = "resumecraft_resumes";

import resumeApi from "../api/resumeApi";

export default function ATSAnalyzerPage() {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [report, setReport] = useState(null);
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

  const handleRunAnalysis = async () => {
    if (!selectedResumeId) {
      toast({ variant: "warning", title: "Select a Resume", description: "Choose a resume to analyze." });
      return;
    }
    if (!jobDescription.trim() || jobDescription.trim().length < 20) {
      toast({ variant: "warning", title: "Job Description Required", description: "Provide a detailed job description (minimum 20 characters)." });
      return;
    }

    setAnalyzing(true);
    setReport(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Extract target words from JD
      const jdWords = jobDescription.toLowerCase();
      const possibleKeywords = [
        "React", "Node.js", "TypeScript", "CI/CD", "AWS", "Docker", "GraphQL", 
        "PostgreSQL", "Agile", "Scrum", "Redux", "REST APIs", "Unit Testing", "Webpack"
      ];

      // Simulate match checks
      const matched = [];
      const missing = [];
      possibleKeywords.forEach(kw => {
        if (jdWords.includes(kw.toLowerCase())) {
          // 65% chance matched in mockup
          if (Math.random() > 0.4) {
            matched.push(kw);
          } else {
            missing.push(kw);
          }
        }
      });

      // Ensure at least some keywords populate
      if (matched.length === 0 && missing.length === 0) {
        matched.push("React", "Git");
        missing.push("TypeScript", "CI/CD", "AWS");
      }

      const score = Math.round(50 + (matched.length / (matched.length + missing.length)) * 45);

      const mockReport = {
        score,
        matchedKeywords: matched,
        missingKeywords: missing,
        warnings: [
          score < 70 ? "Critical keyword mismatch: essential skills from description are missing." : "Strong keyword alignment with target description.",
          "Formatting verification: Layout headers are standard and easily parsable.",
          "Achievement verbs: Bullets use action verbs, but could integrate more metrics/numbers."
        ],
        suggestions: [
          { type: "keyword", text: `Integrate "${missing.slice(0, 3).join(', ')}" in your Work Experience section.` },
          { type: "format", text: "Ensure date strings are in standard format (e.g. June 2023 - Present)." },
          { type: "structure", text: "Quantify achievements by adding percentages, dollar metrics, or hours saved." }
        ]
      };

      setReport(mockReport);

      // Save updated score to resume in database
      try {
        const targetResume = resumes.find(r => r.id === selectedResumeId);
        if (targetResume) {
          const payload = { ...targetResume };
          delete payload._id;
          delete payload.user;
          delete payload.createdAt;
          delete payload.updatedAt;
          delete payload.id;
          
          payload.atsScore = score;
          
          await resumeApi.update(selectedResumeId, payload);
        }
      } catch (err) {
        console.error("Failed to save ATS score:", err);
      }

      toast({
        variant: "success",
        title: "Scan Completed",
        description: `ATS Match Score: ${score}%`
      });
    } catch (err) {
      // ignore
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 text-left">
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          ATS keyword & Scanner Analyzer
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
                onChange={(e) => setSelectedResumeId(e.target.value)}
                placeholder="Choose a profile..."
              >
                {resumes.map(r => (
                  <option key={r.id} value={r.id}>{r.title} ({r.targetRole})</option>
                ))}
              </Select>

              <Textarea
                label="Target Job Description"
                placeholder="Paste the full job responsibilities, skills, and qualifications from the hiring listing..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={9}
              />

              <Button
                onClick={handleRunAnalysis}
                loading={analyzing}
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
          {report ? (
            <div className="space-y-6 animate-fade-in">
              <Card className="glass-premium">
                <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="space-y-3 text-center sm:text-left flex-1">
                    <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                      ATS compatibility score
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal max-w-sm">
                      {report.score >= 80 
                        ? "Excellent match! Your resume contains the core keywords and formatting to clear automated screening phases." 
                        : report.score >= 60 
                          ? "Fair alignment. We recommend adding a few missing keywords to raise your compatibility metrics."
                          : "High risk of automated rejection. Key qualifications from the job posting are missing from your resume."
                      }
                    </p>
                  </div>
                  
                  <div className="shrink-0">
                    <CircularProgress value={report.score} size={120} strokeWidth={10} />
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
                      Matched Keywords ({report.matchedKeywords.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex flex-wrap gap-1.5">
                      {report.matchedKeywords.map(kw => (
                        <Badge key={kw} variant="success" className="text-[10px] uppercase font-bold py-1">
                          {kw}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Missing */}
                <Card className="border-slate-200 dark:border-slate-800">
                  <CardHeader className="pb-3.5 border-b border-slate-100 dark:border-slate-800/40">
                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center gap-1.5">
                      <XCircle className="h-4 w-4" />
                      Missing Keywords ({report.missingKeywords.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex flex-wrap gap-1.5">
                      {report.missingKeywords.map(kw => (
                        <Badge key={kw} variant="danger" className="text-[10px] uppercase font-bold py-1">
                          {kw}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Formatting details list */}
              <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Health Diagnostics Check</CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-0 space-y-3">
                  {report.warnings.map((warn, i) => (
                    <div key={i} className="flex items-start gap-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      {report.score < 70 && i === 0 ? (
                        <AlertTriangle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
                      ) : (
                        <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                      )}
                      <span>{warn}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Suggestions */}
              <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Actionable Improvements</CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-0 space-y-3">
                  {report.suggestions.map((sug, i) => (
                    <div key={i} className="flex items-start gap-3 text-xs leading-relaxed text-slate-650 dark:text-slate-350 bg-slate-50 dark:bg-slate-900/30 p-3 rounded-xl">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400 font-bold text-[10px]">
                        {i + 1}
                      </div>
                      <span>{sug.text}</span>
                    </div>
                  ))}
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
