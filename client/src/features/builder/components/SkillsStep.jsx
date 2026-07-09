import { useState } from "react";
import { useResumeForm } from "../../../contexts/ResumeFormContext";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { X, Plus, Sparkles } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useToast } from "../../../contexts/ToastContext";

export default function SkillsStep() {
  const { resumeData, updateSkills } = useResumeForm();
  const [newSkill, setNewSkill] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const { toast } = useToast();

  const skills = resumeData?.skills || [];

  const handleAddSkill = (e) => {
    if (e) e.preventDefault();
    const cleanSkill = newSkill.trim();
    if (!cleanSkill) return;

    if (skills.includes(cleanSkill)) {
      toast({
        variant: "warning",
        title: "Skill already exists",
        description: `"${cleanSkill}" is already in your skills list.`
      });
      return;
    }

    const updated = [...skills, cleanSkill];
    updateSkills(updated);
    setNewSkill("");
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updated = skills.filter((s) => s !== skillToRemove);
    updateSkills(updated);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleAiSuggest = async () => {
    if (!resumeData?.targetRole) {
      toast({
        variant: "warning",
        title: "Target Title Needed",
        description: "Specify a Target Job Title under Personal Details to fetch standard job skill ideas."
      });
      return;
    }
    setAiLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      let suggested = ["React", "JavaScript", "TypeScript", "HTML5/CSS3", "Git", "REST APIs", "Agile Methodologies"];
      if (resumeData.targetRole.toLowerCase().includes("backend")) {
        suggested = ["Node.js", "Express", "Python", "SQL", "MongoDB", "Docker", "REST APIs", "AWS", "Git"];
      } else if (resumeData.targetRole.toLowerCase().includes("product")) {
        suggested = ["Product Roadmapping", "Agile/Scrum", "SQL", "Jira", "User Research", "Market Analysis", "A/B Testing"];
      }

      // Filter out already added skills
      const toAdd = suggested.filter(s => !skills.includes(s));
      if (toAdd.length === 0) {
        toast({
          variant: "info",
          title: "Skills Up to Date",
          description: "All recommended skills are already in your list."
        });
      } else {
        updateSkills([...skills, ...toAdd]);
        toast({
          variant: "success",
          title: "Skills Imported",
          description: `Added ${toAdd.length} professional skills for ${resumeData.targetRole}.`
        });
      }
    } catch (err) {
      // ignore
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-1">Professional Skills</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">List core technologies, soft skills, or domain expertise.</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAiSuggest}
          loading={aiLoading}
          className="text-violet-600 dark:text-violet-400 hover:text-violet-750 p-0 text-xs flex items-center gap-1"
        >
          <Sparkles className="h-3.5 w-3.5" />
          AI Suggest Skills
        </Button>
      </div>

      <form onSubmit={handleAddSkill} className="flex gap-2">
        <Input
          placeholder="e.g. Next.js, Docker, Kubernetes (Press Enter to add)"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
        />
        <Button type="submit" size="md" icon={Plus}>Add</Button>
      </form>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 min-h-[150px]">
        {skills.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-600 py-6">
            <p className="text-sm">No skills added yet.</p>
            <p className="text-xs mt-1">Type in a skill above or click AI Suggest Skills.</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge
                key={skill}
                variant="primary"
                className="pl-3 pr-1.5 py-1 text-sm font-semibold flex items-center gap-1.5 hover:bg-violet-100 dark:hover:bg-violet-950/50 group transition-all duration-150"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="rounded-full p-0.5 text-violet-400 hover:text-violet-700 dark:hover:text-violet-200 group-hover:bg-white/40 dark:group-hover:bg-white/10"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
