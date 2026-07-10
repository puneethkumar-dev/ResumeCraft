import { useState } from "react";
import { useResumeForm } from "../../../contexts/ResumeFormContext";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Button } from "../../../components/ui/button";
import { Trash2, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "../../../components/ui/card";

export default function ProjectsStep() {
  const { resumeData, addListItem, updateListItem, removeListItem } = useResumeForm();
  const [expandedId, setExpandedId] = useState(null);

  const handleAdd = () => {
    addListItem("projects", {
      name: "",
      technologies: "",
      link: "",
      description: ""
    });
  };

  const handleFieldChange = (id, name, value) => {
    updateListItem("projects", id, { [name]: value });
  };

  const list = resumeData?.projects || [];

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-1">Projects (Optional)</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">List personal or freelance products to demonstrate tech-stack applications.</p>
        </div>
        <Button onClick={handleAdd} size="sm" icon={Plus}>Add Project</Button>
      </div>

      {list.length === 0 ? (
        <Card className="p-8 border-dashed text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">No project entries added yet.</p>
          <Button onClick={handleAdd} variant="outline" size="sm" icon={Plus}>Add First Project</Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {list.map((item, index) => {
            const isExpanded = expandedId === item.id || list.length === 1;
            return (
              <div key={item.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
                <div
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors select-none"
                >
                  <div className="min-w-0">
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                      {item.name || "Untitled Project"}
                    </h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                      {item.technologies || "Technologies"} &bull; {item.link || "No project link"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Trash2}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeListItem("projects", item.id);
                      }}
                      className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                    />
                    {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-5 border-t border-slate-100 dark:border-slate-800/40 space-y-4 bg-slate-50/20 dark:bg-slate-900/10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Project Name"
                        placeholder="e.g. E-Commerce Platform"
                        value={item.name || ""}
                        onChange={(e) => handleFieldChange(item.id, "name", e.target.value)}
                      />
                      <Input
                        label="Technologies / Tools"
                        placeholder="e.g. React, Node.js, GraphQL"
                        value={item.technologies || ""}
                        onChange={(e) => handleFieldChange(item.id, "technologies", e.target.value)}
                      />
                      <Input
                        label="Project Link / URL"
                        placeholder="e.g. github.com/username/project"
                        value={item.link || ""}
                        onChange={(e) => handleFieldChange(item.id, "link", e.target.value)}
                        className="sm:col-span-2"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Project Details / Achievements
                      </label>
                      <Textarea
                        placeholder="e.g. - Built full-stack platform using Vite, Express, and PostgreSQL&#10;- Implemented secure JWT user sessions"
                        value={item.description || ""}
                        onChange={(e) => handleFieldChange(item.id, "description", e.target.value)}
                        rows={4}
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
