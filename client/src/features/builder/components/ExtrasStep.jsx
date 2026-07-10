import { useState } from "react";
import { useResumeForm } from "../../../contexts/ResumeFormContext";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Card } from "../../../components/ui/card";
import { 
  Trash2, Plus, ChevronDown, ChevronUp, X,
  Award, Trophy, Languages, Heart, BookOpen, Compass
} from "lucide-react";

export default function ExtrasStep() {
  const { resumeData, addListItem, updateListItem, removeListItem } = useResumeForm();
  const [activeSubTab, setActiveSubTab] = useState("certifications");
  const [expandedId, setExpandedId] = useState(null);
  const [newInterest, setNewInterest] = useState("");

  const subTabs = [
    { key: "certifications", label: "Certifications", icon: Award, listKey: "certifications" },
    { key: "achievements", label: "Achievements", icon: Trophy, listKey: "achievements" },
    { key: "languages", label: "Languages", icon: Languages, listKey: "languages" },
    { key: "interests", label: "Interests", icon: Compass, listKey: "interests" },
    { key: "volunteer", label: "Volunteer Exp.", icon: Heart, listKey: "volunteerExperience" },
    { key: "publications", label: "Publications", icon: BookOpen, listKey: "publications" }
  ];

  // Helper to add list item based on current active subtab
  const handleAdd = () => {
    if (activeSubTab === "certifications") {
      addListItem("certifications", {
        title: "",
        issuer: "",
        issueDate: "",
        expiryDate: "",
        credentialId: "",
        credentialUrl: ""
      });
    } else if (activeSubTab === "achievements") {
      addListItem("achievements", {
        title: "",
        description: "",
        date: ""
      });
    } else if (activeSubTab === "languages") {
      addListItem("languages", {
        name: "",
        proficiency: ""
      });
    } else if (activeSubTab === "volunteer") {
      addListItem("volunteerExperience", {
        organization: "",
        role: "",
        startDate: "",
        endDate: "",
        description: ""
      });
    } else if (activeSubTab === "publications") {
      addListItem("publications", {
        title: "",
        publisher: "",
        date: "",
        link: "",
        description: ""
      });
    }
  };

  const handleInterestAdd = (e) => {
    if (e) e.preventDefault();
    const clean = newInterest.trim();
    if (!clean) return;
    addListItem("interests", { name: clean });
    setNewInterest("");
  };

  const handleInterestRemove = (id) => {
    removeListItem("interests", id);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 text-left min-h-[450px]">
      
      {/* Left sub-tab bar */}
      <div className="md:w-1/4 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 pb-2 md:pb-0 md:pr-4 shrink-0">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const count = (resumeData[tab.listKey] || []).length;
          const isActive = activeSubTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => {
                setActiveSubTab(tab.key);
                setExpandedId(null);
              }}
              className={`flex items-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold shrink-0 transition-colors cursor-pointer text-left w-full ${
                isActive 
                  ? "bg-violet-50 dark:bg-violet-950/20 text-violet-600 dark:text-violet-400" 
                  : "text-slate-500 hover:bg-slate-55 dark:hover:bg-slate-800/40"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1 truncate">{tab.label}</span>
              {count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isActive ? "bg-violet-200 dark:bg-violet-800 text-violet-700 dark:text-violet-300" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Right Content Area */}
      <div className="flex-1 space-y-4">
        
        {/* Render Certifications */}
        {activeSubTab === "certifications" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-display font-bold text-base text-slate-900 dark:text-white">Certifications (Optional)</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">List relevant industry certifications and credentials.</p>
              </div>
              <Button onClick={handleAdd} size="sm" icon={Plus}>Add Cert</Button>
            </div>

            {(resumeData.certifications || []).length === 0 ? (
              <Card className="p-8 border-dashed text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">No certifications added yet.</p>
                <Button onClick={handleAdd} variant="outline" size="sm" icon={Plus}>Add First Certification</Button>
              </Card>
            ) : (
              <div className="space-y-3">
                {(resumeData.certifications || []).map((item, idx) => {
                  const isExpanded = expandedId === item.id || (resumeData.certifications || []).length === 1;
                  return (
                    <div key={item.id} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
                      <div 
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 select-none"
                      >
                        <div className="min-w-0">
                          <h5 className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                            {item.title || "Untitled Certification"}
                          </h5>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                            {item.issuer || "Organization"} &bull; {item.issueDate || "Issue Date"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            icon={Trash2} 
                            onClick={(e) => { e.stopPropagation(); removeListItem("certifications", item.id); }} 
                            className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                          />
                          {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="p-4 border-t border-slate-100 dark:border-slate-800/40 space-y-4 bg-slate-50/20 dark:bg-slate-900/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Input
                            label="Certification Name"
                            placeholder="e.g. AWS Certified Solutions Architect"
                            value={item.title || ""}
                            onChange={(e) => updateListItem("certifications", item.id, { title: e.target.value })}
                            className="sm:col-span-2"
                          />
                          <Input
                            label="Issuing Organization (Optional)"
                            placeholder="e.g. Amazon Web Services"
                            value={item.issuer || ""}
                            onChange={(e) => updateListItem("certifications", item.id, { issuer: e.target.value })}
                          />
                          <Input
                            label="Issue Date (Optional)"
                            placeholder="e.g. Jan 2024"
                            value={item.issueDate || ""}
                            onChange={(e) => updateListItem("certifications", item.id, { issueDate: e.target.value })}
                          />
                          <Input
                            label="Expiry Date (Optional)"
                            placeholder="e.g. Jan 2027"
                            value={item.expiryDate || ""}
                            onChange={(e) => updateListItem("certifications", item.id, { expiryDate: e.target.value })}
                          />
                          <Input
                            label="Credential ID (Optional)"
                            placeholder="e.g. AWS-12345"
                            value={item.credentialId || ""}
                            onChange={(e) => updateListItem("certifications", item.id, { credentialId: e.target.value })}
                          />
                          <Input
                            label="Credential URL (Optional)"
                            placeholder="e.g. credly.com/..."
                            value={item.credentialUrl || ""}
                            onChange={(e) => updateListItem("certifications", item.id, { credentialUrl: e.target.value })}
                            className="sm:col-span-2"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Render Achievements */}
        {activeSubTab === "achievements" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-display font-bold text-base text-slate-900 dark:text-white">Achievements (Optional)</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">List awards, competition ranks, and career highlights.</p>
              </div>
              <Button onClick={handleAdd} size="sm" icon={Plus}>Add Achievement</Button>
            </div>

            {(resumeData.achievements || []).length === 0 ? (
              <Card className="p-8 border-dashed text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">No achievements added yet.</p>
                <Button onClick={handleAdd} variant="outline" size="sm" icon={Plus}>Add First Entry</Button>
              </Card>
            ) : (
              <div className="space-y-3">
                {(resumeData.achievements || []).map((item, idx) => {
                  const isExpanded = expandedId === item.id || (resumeData.achievements || []).length === 1;
                  return (
                    <div key={item.id} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
                      <div 
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 select-none"
                      >
                        <div className="min-w-0">
                          <h5 className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                            {item.title || "Untitled Achievement"}
                          </h5>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                            {item.date || "Date"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            icon={Trash2} 
                            onClick={(e) => { e.stopPropagation(); removeListItem("achievements", item.id); }} 
                            className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                          />
                          {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="p-4 border-t border-slate-100 dark:border-slate-800/40 space-y-4 bg-slate-50/20 dark:bg-slate-900/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Input
                            label="Achievement Title"
                            placeholder="e.g. Hackathon First Place Winner"
                            value={item.title || ""}
                            onChange={(e) => updateListItem("achievements", item.id, { title: e.target.value })}
                          />
                          <Input
                            label="Date (Optional)"
                            placeholder="e.g. March 2024"
                            value={item.date || ""}
                            onChange={(e) => updateListItem("achievements", item.id, { date: e.target.value })}
                          />
                          <Textarea
                            label="Description (Optional)"
                            placeholder="Detail your success, metrics, or scope..."
                            value={item.description || ""}
                            onChange={(e) => updateListItem("achievements", item.id, { description: e.target.value })}
                            className="sm:col-span-2"
                            rows={3}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Render Languages */}
        {activeSubTab === "languages" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-display font-bold text-base text-slate-900 dark:text-white">Languages (Optional)</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">List languages you speak and your proficiency level.</p>
              </div>
              <Button onClick={handleAdd} size="sm" icon={Plus}>Add Language</Button>
            </div>

            {(resumeData.languages || []).length === 0 ? (
              <Card className="p-8 border-dashed text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">No languages added yet.</p>
                <Button onClick={handleAdd} variant="outline" size="sm" icon={Plus}>Add First Entry</Button>
              </Card>
            ) : (
              <div className="space-y-3">
                {(resumeData.languages || []).map((item, idx) => {
                  const isExpanded = expandedId === item.id || (resumeData.languages || []).length === 1;
                  return (
                    <div key={item.id} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
                      <div 
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 select-none"
                      >
                        <div className="min-w-0">
                          <h5 className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                            {item.name || "Language Name"}
                          </h5>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                            {item.proficiency || "Proficiency Level"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            icon={Trash2} 
                            onClick={(e) => { e.stopPropagation(); removeListItem("languages", item.id); }} 
                            className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                          />
                          {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="p-4 border-t border-slate-100 dark:border-slate-800/40 space-y-4 bg-slate-50/20 dark:bg-slate-900/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Input
                            label="Language"
                            placeholder="e.g. Spanish, German"
                            value={item.name || ""}
                            onChange={(e) => updateListItem("languages", item.id, { name: e.target.value })}
                          />
                          <Input
                            label="Proficiency (Optional)"
                            placeholder="e.g. Fluent, Native, Intermediate"
                            value={item.proficiency || ""}
                            onChange={(e) => updateListItem("languages", item.id, { proficiency: e.target.value })}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Render Interests */}
        {activeSubTab === "interests" && (
          <div className="space-y-4">
            <div>
              <h4 className="font-display font-bold text-base text-slate-900 dark:text-white">Interests (Optional)</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">List hobbies and activities you enjoy outside work.</p>
            </div>

            <form onSubmit={handleInterestAdd} className="flex gap-2">
              <Input
                placeholder="e.g. Open Source, Photography, Hiking"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" icon={Plus}>Add</Button>
            </form>

            <div className="flex flex-wrap gap-2 pt-2">
              {(resumeData.interests || []).length === 0 && (
                <p className="text-xs text-slate-450 italic">No interests added yet.</p>
              )}
              {(resumeData.interests || []).map((item) => (
                <Badge key={item.id} variant="secondary" className="flex items-center gap-1 py-1.5 pl-3 pr-2 rounded-lg text-xs font-medium">
                  {item.name}
                  <button 
                    type="button" 
                    onClick={() => handleInterestRemove(item.id)}
                    className="text-slate-400 hover:text-slate-650 ml-1 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Render Volunteer Experience */}
        {activeSubTab === "volunteer" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-display font-bold text-base text-slate-900 dark:text-white">Volunteer Experience (Optional)</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Detail community service and pro-bono accomplishments.</p>
              </div>
              <Button onClick={handleAdd} size="sm" icon={Plus}>Add Entry</Button>
            </div>

            {(resumeData.volunteerExperience || []).length === 0 ? (
              <Card className="p-8 border-dashed text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">No volunteer experience entries added yet.</p>
                <Button onClick={handleAdd} variant="outline" size="sm" icon={Plus}>Add First Entry</Button>
              </Card>
            ) : (
              <div className="space-y-3">
                {(resumeData.volunteerExperience || []).map((item, idx) => {
                  const isExpanded = expandedId === item.id || (resumeData.volunteerExperience || []).length === 1;
                  return (
                    <div key={item.id} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
                      <div 
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 select-none"
                      >
                        <div className="min-w-0">
                          <h5 className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                            {item.role || "Volunteer Role"}
                          </h5>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                            {item.organization || "Organization"} &bull; {item.startDate || "Start"} - {item.endDate || "End"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            icon={Trash2} 
                            onClick={(e) => { e.stopPropagation(); removeListItem("volunteerExperience", item.id); }} 
                            className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                          />
                          {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="p-4 border-t border-slate-100 dark:border-slate-800/40 space-y-4 bg-slate-50/20 dark:bg-slate-900/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Input
                            label="Organization"
                            placeholder="e.g. Red Cross"
                            value={item.organization || ""}
                            onChange={(e) => updateListItem("volunteerExperience", item.id, { organization: e.target.value })}
                          />
                          <Input
                            label="Role (Optional)"
                            placeholder="e.g. Volunteer coordinator"
                            value={item.role || ""}
                            onChange={(e) => updateListItem("volunteerExperience", item.id, { role: e.target.value })}
                          />
                          <Input
                            label="Start Date (Optional)"
                            placeholder="e.g. June 2021"
                            value={item.startDate || ""}
                            onChange={(e) => updateListItem("volunteerExperience", item.id, { startDate: e.target.value })}
                          />
                          <Input
                            label="End Date (Optional)"
                            placeholder="e.g. Dec 2022"
                            value={item.endDate || ""}
                            onChange={(e) => updateListItem("volunteerExperience", item.id, { endDate: e.target.value })}
                          />
                          <Textarea
                            label="Description (Optional)"
                            placeholder="Describe your volunteer details and impact..."
                            value={item.description || ""}
                            onChange={(e) => updateListItem("volunteerExperience", item.id, { description: e.target.value })}
                            className="sm:col-span-2"
                            rows={3}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Render Publications */}
        {activeSubTab === "publications" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-display font-bold text-base text-slate-900 dark:text-white">Publications (Optional)</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">List books, academic papers, or blog posts.</p>
              </div>
              <Button onClick={handleAdd} size="sm" icon={Plus}>Add Publication</Button>
            </div>

            {(resumeData.publications || []).length === 0 ? (
              <Card className="p-8 border-dashed text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">No publications added yet.</p>
                <Button onClick={handleAdd} variant="outline" size="sm" icon={Plus}>Add First Publication</Button>
              </Card>
            ) : (
              <div className="space-y-3">
                {(resumeData.publications || []).map((item, idx) => {
                  const isExpanded = expandedId === item.id || (resumeData.publications || []).length === 1;
                  return (
                    <div key={item.id} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
                      <div 
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 select-none"
                      >
                        <div className="min-w-0">
                          <h5 className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                            {item.title || "Untitled Publication"}
                          </h5>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                            {item.publisher || "Publisher"} &bull; {item.date || "Date"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            icon={Trash2} 
                            onClick={(e) => { e.stopPropagation(); removeListItem("publications", item.id); }} 
                            className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                          />
                          {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="p-4 border-t border-slate-100 dark:border-slate-800/40 space-y-4 bg-slate-50/20 dark:bg-slate-900/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Input
                            label="Publication Title"
                            placeholder="e.g. Scaling Distributed Microservices"
                            value={item.title || ""}
                            onChange={(e) => updateListItem("publications", item.id, { title: e.target.value })}
                            className="sm:col-span-2"
                          />
                          <Input
                            label="Publisher (Optional)"
                            placeholder="e.g. IEEE Journal, Medium Blog"
                            value={item.publisher || ""}
                            onChange={(e) => updateListItem("publications", item.id, { publisher: e.target.value })}
                          />
                          <Input
                            label="Date (Optional)"
                            placeholder="e.g. Nov 2023"
                            value={item.date || ""}
                            onChange={(e) => updateListItem("publications", item.id, { date: e.target.value })}
                          />
                          <Input
                            label="Link / URL (Optional)"
                            placeholder="e.g. ieeexplore.ieee.org/..."
                            value={item.link || ""}
                            onChange={(e) => updateListItem("publications", item.id, { link: e.target.value })}
                            className="sm:col-span-2"
                          />
                          <Textarea
                            label="Description (Optional)"
                            placeholder="Provide a summary of the published paper or article details..."
                            value={item.description || ""}
                            onChange={(e) => updateListItem("publications", item.id, { description: e.target.value })}
                            className="sm:col-span-2"
                            rows={3}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
