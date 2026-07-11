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

import resumeApi from "../api/resumeApi";

// Local storage keys
const RESUMES_KEY = "resumecraft_resumes";

export default function DashboardPage() {
  const [resumes, setResumes] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const response = await resumeApi.getAll();
      if (response.success && response.data) {
        const aligned = response.data.map(r => ({
          ...r,
          id: r._id,
          lastModified: r.updatedAt || r.createdAt
        }));
        setResumes(aligned);
      }
    } catch (err) {
      toast({
        variant: "danger",
        title: "Failed to Fetch Resumes",
        description: err.response?.data?.message || "Could not retrieve your resumes."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleCreateNew = async () => {
    const defaultResume = {
      title: "Untitled Resume",
      targetRole: "Software Engineer",
      template: "Modern Minimalist",
      completion: 10,
      atsScore: 0,
      personalInfo: { fullName: "Your Name", email: "email@example.com", phone: "", location: "", portfolio: "", linkedin: "", github: "" },
      experience: [],
      education: [
        {
          institution: "Placeholder School",
          degree: "Degree",
          fieldOfStudy: "Field",
          startDate: "2020",
          endDate: "2024"
        }
      ],
      projects: [],
      skills: [],
      certifications: [],
      achievements: []
    };
    
    try {
      const response = await resumeApi.create(defaultResume);
      if (response.success && response.data) {
        toast({
          variant: "success",
          title: "Resume Draft Created",
          description: "Redirecting to builder workspace..."
        });
        const newId = response.data._id;
        setTimeout(() => {
          navigate(`/builder/${newId}`);
        }, 500);
      }
    } catch (err) {
      toast({
        variant: "danger",
        title: "Creation Failed",
        description: err.response?.data?.message || "Could not create a new resume draft."
      });
    }
  };

  const confirmDelete = (id) => {
    setSelectedResumeId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      const response = await resumeApi.delete(selectedResumeId);
      if (response.success) {
        toast({
          variant: "success",
          title: "Resume Deleted",
          description: "The draft was permanently removed."
        });
        fetchResumes();
      }
    } catch (err) {
      toast({
        variant: "danger",
        title: "Delete Failed",
        description: err.response?.data?.message || "Could not delete the resume."
      });
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const filteredResumes = resumes.filter(r => 
    (r.title || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
    (r.targetRole || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const averageAts = resumes.length 
    ? Math.round(resumes.reduce((acc, curr) => acc + (curr.atsScore || 0), 0) / resumes.length) 
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
      <div className="glass-premium rounded-3xl p-6 md:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/50 dark:divide-slate-800/50">
          
          {/* Total Resumes */}
          <div className="flex items-center gap-4 sm:px-4 first:pl-0">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/10 text-violet-600 dark:text-violet-400 shadow-xs">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Resumes</p>
              <h3 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{resumes.length}</h3>
            </div>
          </div>

          {/* Average ATS Score */}
          <div className="flex items-center gap-4 pt-6 sm:pt-0 sm:pl-8 sm:px-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 text-emerald-600 dark:text-emerald-400 shadow-xs">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Avg ATS Score</p>
              <div className="flex items-baseline gap-2 mt-1">
                <h3 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">{averageAts}%</h3>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  averageAts >= 75 ? "bg-emerald-500/10 text-emerald-650" : averageAts >= 50 ? "bg-amber-500/10 text-amber-650" : "bg-red-500/10 text-red-650"
                }`}>
                  {averageAts >= 75 ? "Good" : averageAts >= 50 ? "Average" : "Poor"}
                </span>
              </div>
            </div>
          </div>

          {/* Scans Completed */}
          <div className="flex items-center gap-4 pt-6 sm:pt-0 lg:pl-8 lg:px-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 text-amber-600 dark:text-amber-400 shadow-xs">
              <CheckSquare className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Scans Run</p>
              <h3 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                {resumes.filter(r => r.atsScore > 0).length}
              </h3>
            </div>
          </div>

          {/* Premium Status */}
          <div className="flex items-center gap-4 pt-6 sm:pt-0 lg:pl-8 lg:px-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500/20 to-indigo-500/10 text-sky-600 dark:text-sky-400 shadow-xs">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Plan Status</p>
              <div className="flex items-center gap-1.5 mt-1">
                <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">Free Account</h3>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 border border-violet-200/30">
                  Upgrade
                </span>
              </div>
            </div>
          </div>

        </div>
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

          {loading ? (
            <div className="flex h-40 w-full items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-600 border-t-transparent"></div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Loading your workspace...</p>
              </div>
            </div>
          ) : filteredResumes.length === 0 ? (
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
                <Card 
                  key={resume.id} 
                  onClick={() => navigate(`/preview/${resume.id}`)}
                  className="cursor-pointer hover:shadow-md border-slate-200 hover:border-slate-300 dark:border-slate-800/80 dark:hover:border-slate-700/80 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-all duration-200"
                >
                  <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-display font-bold text-slate-900 dark:text-white truncate">
                          {resume.personalInfo?.fullName ? `${resume.personalInfo.fullName}'s Resume` : resume.title}
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
                    <div className="flex items-center gap-2 sm:self-center shrink-0" onClick={(e) => e.stopPropagation()}>
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
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmDelete(resume.id);
                        }}
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
