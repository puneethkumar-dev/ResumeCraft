import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FileText, Sparkles, CheckSquare, Compass, 
  Trash2, Edit, Eye, Download, Plus, Search, 
  Calendar, CheckCircle, Clock, TrendingUp, ChevronRight
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress, CircularProgress } from "../components/ui/progress";
import { Dialog } from "../components/ui/dialog";
import { useToast } from "../contexts/ToastContext";

// Local storage keys
const RESUMES_KEY = "resumecraft_resumes";

const mockResumes = [
  {
    id: "r1",
    title: "Senior Full Stack Dev - 2026",
    targetRole: "Senior Software Engineer",
    template: "Professional Modern",
    completion: 95,
    atsScore: 85,
    lastModified: "2026-07-07T14:30:00Z"
  },
  {
    id: "r2",
    title: "Project Lead Resume",
    targetRole: "Technical Product Manager",
    template: "Classic Executive",
    completion: 70,
    atsScore: 62,
    lastModified: "2026-06-28T09:15:00Z"
  }
];

export default function DashboardPage() {
  const [resumes, setResumes] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Read from localStorage or write mock defaults if empty
    const localData = localStorage.getItem(RESUMES_KEY);
    if (localData) {
      setResumes(JSON.parse(localData));
    } else {
      localStorage.setItem(RESUMES_KEY, JSON.stringify(mockResumes));
      setResumes(mockResumes);
    }
  }, []);

  const handleCreateNew = () => {
    const id = "res-" + Math.random().toString(36).substring(2, 9);
    const newResume = {
      id,
      title: "Untitled Resume",
      targetRole: "Software Engineer",
      template: "Modern Minimalist",
      completion: 10,
      atsScore: 0,
      lastModified: new Date().toISOString(),
      personalInfo: { name: "", email: "", phone: "", location: "", website: "", summary: "" },
      experience: [],
      education: [],
      projects: [],
      skills: [],
      certifications: [],
      languages: []
    };
    
    const updated = [newResume, ...resumes];
    localStorage.setItem(RESUMES_KEY, JSON.stringify(updated));
    setResumes(updated);
    toast({
      variant: "success",
      title: "Resume Draft Created",
      description: "Redirecting to builder workspace..."
    });
    setTimeout(() => {
      navigate(`/builder/${id}`);
    }, 500);
  };

  const confirmDelete = (id) => {
    setSelectedResumeId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    const updated = resumes.filter(r => r.id !== selectedResumeId);
    localStorage.setItem(RESUMES_KEY, JSON.stringify(updated));
    setResumes(updated);
    setIsDeleteModalOpen(false);
    toast({
      variant: "success",
      title: "Resume Deleted",
      description: "The draft was permanently removed."
    });
  };

  const filteredResumes = resumes.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.targetRole.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const averageAts = resumes.length 
    ? Math.round(resumes.reduce((acc, curr) => acc + curr.atsScore, 0) / resumes.length) 
    : 0;

  return (
    <div className="space-y-8 text-left">
      
      {/* Quick Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            My Workspace
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Build, edit, and track the ATS score of all your job resumes.
          </p>
        </div>

        <Button onClick={handleCreateNew} icon={Plus} size="md" className="shadow-lg shadow-violet-500/10 self-start sm:self-auto">
          Create New Resume
        </Button>
      </div>

      {/* Dashboard Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Resumes</p>
              <h3 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white mt-2">{resumes.length}</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
              <FileText className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average ATS Score</p>
              <h3 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white mt-2">{averageAts}%</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Scans Completed</p>
              <h3 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
                {resumes.filter(r => r.atsScore > 0).length}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <CheckSquare className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Premium Access</p>
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mt-2">Active Free</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <Sparkles className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Sections Splits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Resumes List Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-slate-950 dark:text-white">
              Recent Resumes
            </h2>

            {/* Simple Search */}
            <div className="relative w-48 sm:w-64">
              <Search className="absolute inset-y-0 left-3 flex items-center h-full w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search resumes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-xs outline-hidden focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 dark:text-white"
              />
            </div>
          </div>

          {filteredResumes.length === 0 ? (
            <Card className="p-12 text-center border-dashed">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mb-4">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-2">No resumes found</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
                You haven't created any resumes yet or none match your search. Create one now to begin.
              </p>
              <Button onClick={handleCreateNew} size="sm" icon={Plus}>Create Resume</Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredResumes.map((resume) => (
                <Card key={resume.id} className="hover:shadow-xs border-slate-200 hover:border-slate-300 dark:border-slate-800/80 dark:hover:border-slate-700/80 transition-all duration-200">
                  <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-display font-bold text-slate-900 dark:text-white truncate">
                          {resume.title}
                        </h4>
                        {resume.completion === 100 && (
                          <Badge variant="success">Completed</Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        Target: <span className="font-semibold text-slate-700 dark:text-slate-300">{resume.targetRole}</span> &bull; {resume.template}
                      </p>
                      <div className="flex items-center gap-4 text-[10px] text-slate-400 dark:text-slate-500 pt-1">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Last modified {new Date(resume.lastModified).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {resume.completion}% Complete</span>
                      </div>
                      
                      {/* Completion Progress Bar */}
                      <div className="w-full max-w-xs pt-2">
                        <Progress value={resume.completion} size="sm" />
                      </div>
                    </div>

                    {/* Actions Split */}
                    <div className="flex items-center gap-2 sm:self-center shrink-0">
                      <Link to={`/builder/${resume.id}`}>
                        <Button variant="outline" size="sm" icon={Edit} title="Edit resume" />
                      </Link>
                      <Link to={`/preview/${resume.id}`}>
                        <Button variant="outline" size="sm" icon={Eye} title="Preview Resume" />
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        icon={Trash2}
                        onClick={() => confirmDelete(resume.id)}
                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 border-transparent hover:border-red-200"
                        title="Delete resume"
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Side Panel: ATS insights + activity */}
        <div className="space-y-6">
          <Card className="glass">
            <CardHeader className="pb-3">
              <CardTitle>ATS Diagnostics</CardTitle>
              <CardDescription>Average ATS ranking computed across all resume profiles.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center py-4">
              <CircularProgress value={averageAts} size={130} strokeWidth={11} />
              
              <div className="mt-6 text-center space-y-2">
                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {averageAts >= 75 ? "Excellent Rating" : averageAts >= 50 ? "Average Rating" : "Action Required"}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-normal">
                  {averageAts >= 75 
                    ? "Your resumes are highly structured and formatted to pass major enterprise screening software."
                    : "Add target keywords from job listings inside the ATS Analyzer to raise your score."
                  }
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Shortcuts */}
          <Card className="glass">
            <CardHeader className="pb-3">
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <button 
                onClick={handleCreateNew}
                className="flex w-full items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-left transition-colors text-xs font-semibold"
              >
                <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <FileText className="h-4 w-4 text-violet-500" />
                  Create blank resume
                </span>
                <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              </button>

              <Link 
                to="/ats" 
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-left transition-colors text-xs font-semibold"
              >
                <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <CheckSquare className="h-4 w-4 text-emerald-500" />
                  Run ATS scan check
                </span>
                <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              </Link>

              <Link 
                to="/templates"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-left transition-colors text-xs font-semibold"
              >
                <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Compass className="h-4 w-4 text-amber-500" />
                  Explore templates
                </span>
                <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              </Link>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      <Dialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Resume"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-500">
            Are you sure you want to permanently delete this resume draft? This action is irreversible.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleDelete}>
              Confirm Delete
            </Button>
          </div>
        </div>
      </Dialog>

    </div>
  );
}
