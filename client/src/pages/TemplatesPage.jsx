import { useNavigate } from "react-router-dom";
import { Compass, CheckCircle2, ArrowRight, Eye, Layout } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { useToast } from "../contexts/ToastContext";

const RESUMES_KEY = "resumecraft_resumes";

const availableTemplates = [
  {
    id: "tpl_minimal",
    name: "Modern Minimalist",
    description: "Sleek margins, system fonts, and categorised tags. Best suited for software engineers, product managers, and developers.",
    roles: "Engineering, Design, Product",
    rating: "4.9/5 Recruiter score"
  },
  {
    id: "tpl_executive",
    name: "Classic Executive",
    description: "Serif typography, clean centered header metadata, and traditional double horizontal borders. Best for business development, law, and senior management.",
    roles: "Finance, Management, Strategy",
    rating: "4.8/5 Recruiter score"
  },
  {
    id: "tpl_creative",
    name: "Creative Modern",
    description: "Slightly asymmetric design with a left vertical colored bar and structured bullets. Ideal for marketing, sales, and content creators.",
    roles: "Marketing, Sales, Design",
    rating: "4.7/5 Recruiter score"
  }
];

export default function TemplatesPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleUseTemplate = (templateName) => {
    // Create new resume draft
    const id = "res-" + Math.random().toString(36).substring(2, 9);
    const newResume = {
      id,
      title: "My " + templateName + " Draft",
      targetRole: "Professional Role",
      template: templateName,
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

    const localData = localStorage.getItem(RESUMES_KEY);
    const list = localData ? JSON.parse(localData) : [];
    const updated = [newResume, ...list];
    
    localStorage.setItem(RESUMES_KEY, JSON.stringify(updated));
    toast({
      variant: "success",
      title: "Template Activated",
      description: `Draft created using "${templateName}". Redirecting...`
    });
    setTimeout(() => {
      navigate(`/builder/${id}`);
    }, 500);
  };

  return (
    <div className="space-y-8 text-left">
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Recruiter-approved templates
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Pick a foundation optimized for applicant tracking systems and edit with your credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {availableTemplates.map((tpl) => (
          <Card key={tpl.id} className="flex flex-col h-full hover:shadow-md transition-all duration-300 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700">
            {/* Visual template mock skeleton */}
            <div className="h-44 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-850 p-6 flex flex-col justify-between relative overflow-hidden select-none">
              <div className="absolute top-0 right-0 h-40 w-40 bg-violet-600/5 dark:bg-violet-500/5 rounded-full blur-2xl"></div>
              {/* Fake paper structure */}
              <div className="bg-white dark:bg-slate-950 p-4 border border-slate-200/50 dark:border-slate-800 rounded-sm shadow-xs flex-1 flex flex-col justify-between text-left">
                <div>
                  <div className="h-2.5 w-1/3 bg-slate-250 dark:bg-slate-800 rounded-sm mb-1.5"></div>
                  <div className="h-1.5 w-1/2 bg-slate-150 dark:bg-slate-850 rounded-sm"></div>
                </div>
                <div className="space-y-1">
                  <div className="h-1 w-full bg-slate-100 dark:bg-slate-900 rounded-sm"></div>
                  <div className="h-1 w-5/6 bg-slate-100 dark:bg-slate-900 rounded-sm"></div>
                  <div className="h-1 w-2/3 bg-slate-100 dark:bg-slate-900 rounded-sm"></div>
                </div>
              </div>
            </div>

            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge variant="primary" className="text-[9px] uppercase font-bold py-0.5">{tpl.rating}</Badge>
              </div>
              <CardTitle className="text-base mt-2">{tpl.name}</CardTitle>
            </CardHeader>

            <CardContent className="flex-1 pb-4">
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">{tpl.description}</p>
              <div className="space-y-1.5">
                <p className="text-[10px] uppercase font-bold text-slate-400">Target Roles</p>
                <p className="text-xs text-slate-700 dark:text-slate-350 font-semibold">{tpl.roles}</p>
              </div>
            </CardContent>

            <CardFooter className="pt-3 border-t border-slate-100 dark:border-slate-800/40">
              <Button
                onClick={() => handleUseTemplate(tpl.name)}
                className="w-full"
                icon={ArrowRight}
                iconPosition="right"
                size="sm"
              >
                Use Template
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
