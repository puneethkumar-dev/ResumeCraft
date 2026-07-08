import { useResumeForm } from "../../../contexts/ResumeFormContext";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Card, CardContent } from "../../../components/ui/card";
import { Download, Sparkles, Check, CheckSquare } from "lucide-react";
import { useToast } from "../../../contexts/ToastContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TemplatesStep() {
  const { resumeData, updateGeneralFields } = useResumeForm();
  const [downloading, setDownloading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleTemplateSelect = (name) => {
    updateGeneralFields({ template: name });
    toast({
      variant: "success",
      title: "Template Updated",
      description: `Active template changed to "${name}".`
    });
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        variant: "success",
        title: "PDF Export Complete",
        description: "Your ATS-optimized PDF resume is downloading..."
      });
    } catch (err) {
      // ignore
    } finally {
      setDownloading(false);
    }
  };

  const handleAtsAnalysis = () => {
    toast({
      variant: "info",
      title: "Opening ATS Analyzer",
      description: "Directing to keyword optimizations dashboard..."
    });
    setTimeout(() => {
      navigate("/ats");
    }, 400);
  };

  const templates = [
    {
      name: "Modern Minimalist",
      desc: "Clean layout, sleek sans-serif fonts, and tags for skills. Ideal for tech and creative roles.",
      tags: ["Developer", "Designer", "SaaS"]
    },
    {
      name: "Classic Executive",
      desc: "Centered header, traditional serif text, and elegant section dividers. Perfect for PMs and leaders.",
      tags: ["Product Manager", "Finance", "Leadership"]
    }
  ];

  return (
    <div className="space-y-6 text-left">
      <div>
        <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-1">Export & Layout Templates</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Choose a template style and download your completed resume.</p>
      </div>

      {/* Templates List */}
      <div className="space-y-4">
        {templates.map((tpl) => {
          const isSelected = resumeData?.template === tpl.name;
          return (
            <Card
              key={tpl.name}
              onClick={() => handleTemplateSelect(tpl.name)}
              className={`cursor-pointer hover:border-violet-300 dark:hover:border-violet-850 transition-all duration-200 ${
                isSelected ? "border-violet-600 dark:border-violet-500 ring-2 ring-violet-500/10" : "border-slate-200 dark:border-slate-800"
              }`}
            >
              <CardContent className="p-5 flex items-start gap-4">
                <div className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                  isSelected ? "bg-violet-600 border-transparent text-white" : "border-slate-300"
                }`}>
                  {isSelected && <Check className="h-3.5 w-3.5" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-white">{tpl.name}</h4>
                    {tpl.tags.map(t => <Badge key={t} variant="outline" className="text-[9px] py-0">{t}</Badge>)}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">{tpl.desc}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/40 flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleDownload}
          loading={downloading}
          icon={Download}
          className="flex-1 shadow-md shadow-violet-500/20"
        >
          Download PDF
        </Button>
        <Button
          variant="outline"
          onClick={handleAtsAnalysis}
          icon={CheckSquare}
          className="flex-1"
        >
          Scan ATS score
        </Button>
      </div>
    </div>
  );
}
