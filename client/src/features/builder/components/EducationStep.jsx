import { useState } from "react";
import { useResumeForm } from "../../../contexts/ResumeFormContext";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Trash2, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "../../../components/ui/card";

export default function EducationStep() {
  const { resumeData, addListItem, updateListItem, removeListItem } = useResumeForm();
  const [expandedId, setExpandedId] = useState(null);

  const handleAdd = () => {
    addListItem("education", {
      school: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      gpa: ""
    });
  };

  const handleFieldChange = (id, name, value) => {
    updateListItem("education", id, { [name]: value });
  };

  const list = resumeData?.education || [];

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-1">Education</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">List your academic qualifications and coursework milestones.</p>
        </div>
        <Button onClick={handleAdd} size="sm" icon={Plus}>Add Education</Button>
      </div>

      {list.length === 0 ? (
        <Card className="p-8 border-dashed text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">No education entries added yet.</p>
          <Button onClick={handleAdd} variant="outline" size="sm" icon={Plus}>Add First Entry</Button>
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
                      {item.degree ? `${item.degree} in ${item.fieldOfStudy || 'Field'}` : "Untitled Education"}
                    </h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                      {item.school || "School / University"} &bull; {item.startDate || "Start"} - {item.endDate || "Graduation"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Trash2}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeListItem("education", item.id);
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
                        label="School / University"
                        placeholder="e.g. Stanford University"
                        value={item.school || ""}
                        onChange={(e) => handleFieldChange(item.id, "school", e.target.value)}
                        className="sm:col-span-2"
                      />
                      <Input
                        label="Degree"
                        placeholder="e.g. Bachelor of Science"
                        value={item.degree || ""}
                        onChange={(e) => handleFieldChange(item.id, "degree", e.target.value)}
                      />
                      <Input
                        label="Field of Study"
                        placeholder="e.g. Computer Science"
                        value={item.fieldOfStudy || ""}
                        onChange={(e) => handleFieldChange(item.id, "fieldOfStudy", e.target.value)}
                      />
                      <Input
                        label="Start Date"
                        placeholder="e.g. Sept 2019"
                        value={item.startDate || ""}
                        onChange={(e) => handleFieldChange(item.id, "startDate", e.target.value)}
                      />
                      <Input
                        label="End Date (or expected)"
                        placeholder="e.g. May 2023"
                        value={item.endDate || ""}
                        onChange={(e) => handleFieldChange(item.id, "endDate", e.target.value)}
                      />
                      <Input
                        label="GPA / Grade (Optional)"
                        placeholder="e.g. 3.8/4.0 or 85%"
                        value={item.gpa || ""}
                        onChange={(e) => handleFieldChange(item.id, "gpa", e.target.value)}
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
