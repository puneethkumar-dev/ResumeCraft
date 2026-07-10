import { useState } from "react";
import { 
  ResumeFormProvider, 
  useResumeForm 
} from "../contexts/ResumeFormContext";
import PersonalInfoStep from "../features/builder/components/PersonalInfoStep";
import ExperienceStep from "../features/builder/components/ExperienceStep";
import EducationStep from "../features/builder/components/EducationStep";
import ProjectsStep from "../features/builder/components/ProjectsStep";
import SkillsStep from "../features/builder/components/SkillsStep";
import ExtrasStep from "../features/builder/components/ExtrasStep";
import TemplatesStep from "../features/builder/components/TemplatesStep";
import ResumeLivePreview from "../features/builder/components/ResumeLivePreview";

import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { 
  ArrowLeft, ArrowRight, Save, RotateCcw, 
  User, Briefcase, GraduationCap, FolderGit, 
  Hammer, Compass, ZoomIn, ZoomOut, CheckCircle, Award
} from "lucide-react";
import { cn } from "../utils/cn";
import { useNavigate } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import { getResumeDisplayName } from "../utils/resume";

const steps = [
  { label: "Identity", icon: User },
  { label: "Work", icon: Briefcase },
  { label: "Studies", icon: GraduationCap },
  { label: "Projects", icon: FolderGit },
  { label: "Skills", icon: Hammer },
  { label: "Extras", icon: Award },
  { label: "Templates", icon: Compass }
];

function BuilderContent() {
  const { 
    resumeData, 
    loading, 
    activeStep, 
    setActiveStep, 
    updateGeneralFields, 
    resetForm,
    autosaveStatus,
    flushSave
  } = useResumeForm();
  
  const [zoomScale, setZoomScale] = useState(1);
  const navigate = useNavigate();
  const { toast } = useToast();

  if (loading || !resumeData) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-600 border-t-transparent"></div>
      </div>
    );
  }

  const renderStep = () => {
    switch (activeStep) {
      case 0: return <PersonalInfoStep />;
      case 1: return <ExperienceStep />;
      case 2: return <EducationStep />;
      case 3: return <ProjectsStep />;
      case 4: return <SkillsStep />;
      case 5: return <ExtrasStep />;
      case 6: return <TemplatesStep />;
      default: return <PersonalInfoStep />;
    }
  };

  const validateCurrentStep = () => {
    if (activeStep === 0) {
      const info = resumeData.personalInfo || {};
      if (!info.fullName?.trim()) {
        toast({ variant: "danger", title: "Validation Error", description: "Full Name is required." });
        return false;
      }
      if (!resumeData.targetRole?.trim()) {
        toast({ variant: "danger", title: "Validation Error", description: "Target Job Title is required." });
        return false;
      }
      if (!info.email?.trim()) {
        toast({ variant: "danger", title: "Validation Error", description: "Email is required." });
        return false;
      }
      if (!info.phone?.trim()) {
        toast({ variant: "danger", title: "Validation Error", description: "Phone Number is required." });
        return false;
      }
    }

    if (activeStep === 2) {
      const edu = resumeData.education || [];
      if (edu.length === 0) {
        toast({ variant: "danger", title: "Validation Error", description: "At least one education entry is required." });
        return false;
      }
      for (let i = 0; i < edu.length; i++) {
        const item = edu[i];
        if (!item.school?.trim()) {
          toast({ variant: "danger", title: "Validation Error", description: `School / University is required for entry #${i + 1}.` });
          return false;
        }
        if (!item.degree?.trim()) {
          toast({ variant: "danger", title: "Validation Error", description: `Degree is required for entry #${i + 1}.` });
          return false;
        }
        if (!item.fieldOfStudy?.trim()) {
          toast({ variant: "danger", title: "Validation Error", description: `Field of Study is required for entry #${i + 1}.` });
          return false;
        }
      }
    }

    if (activeStep === 4) {
      const skills = resumeData.skills || [];
      if (skills.length === 0) {
        toast({ variant: "danger", title: "Validation Error", description: "At least one skill is required." });
        return false;
      }
    }

    if (activeStep === 5) {
      const certs = resumeData.certifications || [];
      for (let i = 0; i < certs.length; i++) {
        if (!certs[i].title?.trim()) {
          toast({ variant: "danger", title: "Validation Error", description: `Certification Name is required for entry #${i + 1}.` });
          return false;
        }
      }
      const achs = resumeData.achievements || [];
      for (let i = 0; i < achs.length; i++) {
        if (!achs[i].title?.trim()) {
          toast({ variant: "danger", title: "Validation Error", description: `Achievement Title is required for entry #${i + 1}.` });
          return false;
        }
      }
      const langs = resumeData.languages || [];
      for (let i = 0; i < langs.length; i++) {
        if (!langs[i].name?.trim()) {
          toast({ variant: "danger", title: "Validation Error", description: `Language name is required for entry #${i + 1}.` });
          return false;
        }
      }
      const vols = resumeData.volunteerExperience || [];
      for (let i = 0; i < vols.length; i++) {
        if (!vols[i].organization?.trim()) {
          toast({ variant: "danger", title: "Validation Error", description: `Organization name is required for volunteer entry #${i + 1}.` });
          return false;
        }
      }
      const pubs = resumeData.publications || [];
      for (let i = 0; i < pubs.length; i++) {
        if (!pubs[i].title?.trim()) {
          toast({ variant: "danger", title: "Validation Error", description: `Publication Title is required for entry #${i + 1}.` });
          return false;
        }
      }
    }

    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      toast({
        variant: "success",
        title: "Draft Autosaved",
        description: "Your configurations are up-to-date."
      });
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      
      {/* Top Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 dark:border-slate-800 pb-5 gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={async () => {
              await flushSave();
              navigate("/dashboard");
            }}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-55 hover:dark:bg-slate-800/40 text-slate-500"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </button>
          <div>
            <input
              type="text"
              value={
                resumeData.title === "Untitled Resume" || 
                resumeData.title === "New Resume" || 
                resumeData.title === "My New Resume" || 
                (resumeData.title && resumeData.title.startsWith("My ") && resumeData.title.endsWith(" Draft"))
                  ? ""
                  : resumeData.title || ""
              }
              onChange={(e) => updateGeneralFields({ title: e.target.value })}
              placeholder={getResumeDisplayName(resumeData)}
              className="font-display text-lg font-bold text-slate-900 dark:text-white bg-transparent border-b border-transparent hover:border-slate-300 focus:border-violet-500 outline-hidden py-0.5 px-1 focus:ring-0"
            />
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-slate-450 font-semibold uppercase tracking-wider pl-1 mt-0.5">
              <span>Draft &bull; {resumeData.completion}% Complete</span>
              <span>&bull;</span>
              {autosaveStatus === "saving" && (
                <span className="flex items-center gap-1.5 text-violet-500 font-bold">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-ping"></span>
                  Saving...
                </span>
              )}
              {autosaveStatus === "saved" && (
                <span className="flex items-center gap-1.5 text-emerald-500 font-bold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  Saved
                </span>
              )}
              {autosaveStatus === "unsaved" && (
                <span className="flex items-center gap-1.5 text-amber-500 font-bold">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                  Unsaved changes
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Global Toolbar */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={RotateCcw}
            onClick={resetForm}
            className="text-slate-500"
          >
            Reset
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={Save}
            onClick={async () => {
              await flushSave();
              toast({ variant: "success", title: "Progress Saved", description: "Your changes have been saved to the database." });
              navigate("/dashboard");
            }}
          >
            Save & Exit
          </Button>
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <div className="flex items-center justify-between overflow-x-auto pb-2 border-b border-slate-100 dark:border-slate-800/40 gap-4 scrollbar-none">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = idx === activeStep;
          const isCompleted = idx < activeStep;
          return (
             <button
               key={step.label}
               onClick={() => {
                 if (idx > activeStep && !validateCurrentStep()) return;
                 setActiveStep(idx);
               }}
              className={cn(
                "flex items-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold shrink-0 transition-colors select-none",
                isActive 
                  ? "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/20" 
                  : isCompleted 
                    ? "text-emerald-600 dark:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800/50" 
                    : "text-slate-400 dark:text-slate-500 hover:bg-slate-55 dark:hover:bg-slate-800/50"
              )}
            >
              {isCompleted ? (
                <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
              ) : (
                <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-violet-500" : "text-slate-400")} />
              )}
              {step.label}
            </button>
          );
        })}
      </div>

      {/* Splitted Panel Editor Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Step Forms */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="glass">
            <CardContent className="p-6">
              {renderStep()}
            </CardContent>
          </Card>

          {/* Navigation controls */}
          <div className="flex justify-between items-center gap-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={activeStep === 0}
              icon={ArrowLeft}
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              icon={activeStep === steps.length - 1 ? CheckCircle : ArrowRight}
              iconPosition="right"
            >
              {activeStep === steps.length - 1 ? "Save Progress" : "Next Step"}
            </Button>
          </div>
        </div>

        {/* Right column: Live Document Preview */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-sm text-slate-800 dark:text-slate-350">
              Live Preview
            </h3>
            
            {/* Zoom Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setZoomScale(Math.max(0.7, zoomScale - 0.1))}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-500"
                title="Zoom Out"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <span className="text-[10px] font-bold text-slate-400 w-8 text-center">{Math.round(zoomScale * 100)}%</span>
              <button
                onClick={() => setZoomScale(Math.min(1.2, zoomScale + 0.1))}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-500"
                title="Zoom In"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="w-full overflow-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 p-6 max-h-[70vh]">
            <ResumeLivePreview scale={zoomScale} />
          </div>
        </div>

      </div>

    </div>
  );
}

export default function ResumeBuilderPage() {
  return (
    <ResumeFormProvider>
      <BuilderContent />
    </ResumeFormProvider>
  );
}
