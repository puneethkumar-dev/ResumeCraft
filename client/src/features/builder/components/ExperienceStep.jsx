import { useState } from "react";
import { useResumeForm } from "../../../contexts/ResumeFormContext";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Button } from "../../../components/ui/button";
import { Trash2, Plus, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "../../../contexts/ToastContext";
import { Card } from "../../../components/ui/card";

export default function ExperienceStep() {
  const { resumeData, addListItem, updateListItem, removeListItem } = useResumeForm();
  const [expandedId, setExpandedId] = useState(null);
  const [aiLoadingId, setAiLoadingId] = useState(null);
  const { toast } = useToast();

  const handleAdd = () => {
    const newId = "exp-" + Math.random().toString(36).substring(2, 9);
    addListItem("experience", {
      company: "",
      role: "",
      location: "",
      startDate: "",
      endDate: "",
      description: ""
    });
    // Find the newly added element and expand it
    setTimeout(() => {
      const exp = resumeData?.experience || [];
      if (exp.length > 0) {
        setExpandedId(exp[exp.length - 1].id);
      }
    }, 50);
  };

  const handleFieldChange = (id, name, value) => {
    updateListItem("experience", id, { [name]: value });
  };

  const handleImproveBullets = async (id, currentText) => {
    if (!currentText || currentText.trim().length < 10) {
      toast({
        variant: "warning",
        title: "More Content Needed",
        description: "Please type a short description of your job tasks before refining."
      });
      return;
    }
    setAiLoadingId(id);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const mockBulletPoint = 
        "- Spearheaded redesign of core microservices, resulting in a 42% reduction in server latencies.\n" +
        "- Formulated automated CI/CD deployment channels using Github Actions, slicing release times by 3.5 hours.\n" +
        "- Collaborated with cross-functional product design groups to deliver 5 responsive customer platforms.";
      
      updateListItem("experience", id, { description: mockBulletPoint });
      toast({
        variant: "success",
        title: "Bullets Optimized",
        description: "Applied metric-oriented wording to achievements."
      });
    } catch (err) {
      // ignore
    } finally {
      setAiLoadingId(null);
    }
  };

  const list = resumeData?.experience || [];

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-1">Work Experience (Optional)</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Detail your past professional roles and accomplishments.</p>
        </div>
        <Button onClick={handleAdd} size="sm" icon={Plus}>Add Role</Button>
      </div>

      {list.length === 0 ? (
        <Card className="p-8 border-dashed text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">No experience entries added yet.</p>
          <Button onClick={handleAdd} variant="outline" size="sm" icon={Plus}>Add First Experience</Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {list.map((item, index) => {
            const isExpanded = expandedId === item.id || list.length === 1;
            return (
              <div key={item.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
                {/* Header/Accordion Trigger */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors select-none"
                >
                  <div className="min-w-0">
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                      {item.role || "Untitled Role"}
                    </h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                      {item.company || "Company Name"} &bull; {item.startDate || "Start"} - {item.endDate || "End"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Trash2}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeListItem("experience", item.id);
                      }}
                      className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                    />
                    {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                  </div>
                </div>

                {/* Form Fields Body */}
                {isExpanded && (
                  <div className="p-5 border-t border-slate-100 dark:border-slate-800/40 space-y-4 bg-slate-50/20 dark:bg-slate-900/10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Company / Employer"
                        placeholder="e.g. Google"
                        value={item.company || ""}
                        onChange={(e) => handleFieldChange(item.id, "company", e.target.value)}
                      />
                      <Input
                        label="Job Role / Title"
                        placeholder="e.g. Frontend Developer"
                        value={item.role || ""}
                        onChange={(e) => handleFieldChange(item.id, "role", e.target.value)}
                      />
                      <Input
                        label="Start Date"
                        placeholder="e.g. June 2023"
                        value={item.startDate || ""}
                        onChange={(e) => handleFieldChange(item.id, "startDate", e.target.value)}
                      />
                      <Input
                        label="End Date"
                        placeholder="e.g. Present"
                        value={item.endDate || ""}
                        onChange={(e) => handleFieldChange(item.id, "endDate", e.target.value)}
                      />
                      <Input
                        label="Location"
                        placeholder="e.g. California, US"
                        value={item.location || ""}
                        onChange={(e) => handleFieldChange(item.id, "location", e.target.value)}
                        className="sm:col-span-2"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                          Role Achievements / Bullets
                        </label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleImproveBullets(item.id, item.description)}
                          loading={aiLoadingId === item.id}
                          className="text-violet-600 dark:text-violet-400 hover:text-violet-750 p-0 text-xs flex items-center gap-1"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          Optimize Bullets (AI)
                        </Button>
                      </div>
                      <Textarea
                        placeholder="e.g. - Developed responsive layouts using React and Tailwind CSS&#10;- Wrote unit tests using Jest"
                        value={item.description || ""}
                        onChange={(e) => handleFieldChange(item.id, "description", e.target.value)}
                        rows={5}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
