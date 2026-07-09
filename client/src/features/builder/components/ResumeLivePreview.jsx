import { useResumeForm } from "../../../contexts/ResumeFormContext";
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { cn } from "../../../utils/cn";

export default function ResumeLivePreview({ scale = 1, useAI = false }) {
  const { resumeData } = useResumeForm();

  if (!resumeData) return null;

  const { personalInfo = {}, experience = [], education = [], projects = [], skills = [], generatedContent = {} } = resumeData;

  const displaySummary = (useAI && generatedContent?.summary) ? generatedContent.summary : resumeData.summary;
  const displayExperience = (useAI && generatedContent?.experience?.length > 0) ? generatedContent.experience : experience;
  const displayProjects = (useAI && generatedContent?.projects?.length > 0) ? generatedContent.projects : projects;

  // Modern Minimalist Template Rendering
  const renderMinimalist = () => (
    <div className="text-left font-sans text-slate-800 dark:text-slate-200">
      {/* Header */}
      <div className="border-b-2 border-slate-100 pb-5">
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase leading-none">
          {personalInfo.fullName || "YOUR NAME"}
        </h1>
        <p className="text-sm font-bold text-violet-600 dark:text-violet-400 mt-1.5 tracking-wide uppercase">
          {resumeData.targetRole || "Target Professional Title"}
        </p>
        
        {/* Contact info grid */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[10px] text-slate-500 mt-3.5">
          {personalInfo.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3 shrink-0" /> {personalInfo.email}</span>}
          {personalInfo.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3 shrink-0" /> {personalInfo.phone}</span>}
          {personalInfo.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3 shrink-0" /> {personalInfo.location}</span>}
          {personalInfo.portfolio && <span className="flex items-center gap-1"><Globe className="h-3 w-3 shrink-0" /> {personalInfo.portfolio}</span>}
          {personalInfo.linkedin && <span className="flex items-center gap-1">LinkedIn: {personalInfo.linkedin}</span>}
          {personalInfo.github && <span className="flex items-center gap-1">GitHub: {personalInfo.github}</span>}
        </div>
      </div>

      {/* Summary */}
      {displaySummary && (
        <div className="py-4 border-b border-slate-100">
          <h2 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-widest mb-1.5">Profile</h2>
          <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-350">{displaySummary}</p>
        </div>
      )}

      {/* Experience */}
      {displayExperience.length > 0 && (
        <div className="py-4 border-b border-slate-100">
          <h2 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-widest mb-3">Experience</h2>
          <div className="space-y-4">
            {displayExperience.map((exp) => (
              <div key={exp.id || exp._id} className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">{exp.role || "Job Title"}</h3>
                  <span className="text-[10px] text-slate-400 font-semibold">{exp.startDate} - {exp.endDate}</span>
                </div>
                <div className="flex justify-between items-baseline text-[10px] text-slate-500 font-semibold">
                  <span>{exp.company || "Company"}</span>
                  <span>{exp.location}</span>
                </div>
                {exp.description && (
                  <p className="text-[10px] leading-relaxed text-slate-600 dark:text-slate-350 whitespace-pre-line pl-1.5 border-l border-slate-200">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="py-4 border-b border-slate-100">
          <h2 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-widest mb-3">Education</h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id || edu._id} className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    {edu.degree || "Degree"} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-semibold">{edu.startDate} - {edu.endDate}</span>
                </div>
                <div className="flex justify-between items-baseline text-[10px] text-slate-500 font-semibold">
                  <span>{edu.institution || edu.school || "University"}</span>
                  {edu.cgpa && <span>GPA: {edu.cgpa}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {displayProjects.length > 0 && (
        <div className="py-4 border-b border-slate-100">
          <h2 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-widest mb-3">Projects</h2>
          <div className="space-y-3">
            {displayProjects.map((proj) => (
              <div key={proj.id || proj._id} className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">{proj.title || "Project Title"}</h3>
                  {proj.liveDemo && <span className="text-[9px] text-violet-500 lowercase font-medium">{proj.liveDemo}</span>}
                </div>
                {proj.technologies && (
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    {Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}
                  </p>
                )}
                {proj.description && (
                  <p className="text-[10px] leading-relaxed text-slate-600 dark:text-slate-350 whitespace-pre-line">
                    {proj.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="py-4">
          <h2 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-widest mb-2.5">Skills</h2>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill) => (
              <span key={skill} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Classic Executive Template Rendering
  const renderExecutive = () => (
    <div className="text-center font-serif text-slate-800 dark:text-slate-200">
      {/* Header */}
      <div className="border-b border-double border-slate-300 pb-4">
        <h1 className="text-2xl font-bold tracking-wide text-slate-950 dark:text-white leading-none">
          {personalInfo.fullName || "YOUR NAME"}
        </h1>
        <p className="text-xs italic text-slate-500 mt-1">
          {resumeData.targetRole || "Target Professional Title"}
        </p>
        
        {/* Contact info list */}
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-[9px] text-slate-600 mt-2 font-medium">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>&bull; {personalInfo.phone}</span>}
          {personalInfo.location && <span>&bull; {personalInfo.location}</span>}
          {personalInfo.portfolio && <span>&bull; {personalInfo.portfolio}</span>}
          {personalInfo.linkedin && <span>&bull; LinkedIn: {personalInfo.linkedin}</span>}
          {personalInfo.github && <span>&bull; GitHub: {personalInfo.github}</span>}
        </div>
      </div>

      {/* Summary */}
      {displaySummary && (
        <div className="py-3 text-left">
          <h2 className="text-xs font-bold uppercase text-slate-950 dark:text-white border-b border-slate-300 pb-0.5 mb-1.5 tracking-wider">Executive Profile</h2>
          <p className="text-[10px] italic leading-relaxed text-slate-700 dark:text-slate-300">{displaySummary}</p>
        </div>
      )}

      {/* Experience */}
      {displayExperience.length > 0 && (
        <div className="py-3 text-left">
          <h2 className="text-xs font-bold uppercase text-slate-955 dark:text-white border-b border-slate-300 pb-0.5 mb-2 tracking-wider">Professional Experience</h2>
          <div className="space-y-3">
            {displayExperience.map((exp) => (
              <div key={exp.id || exp._id} className="space-y-0.5">
                <div className="flex justify-between items-baseline font-bold text-[10px] text-slate-900 dark:text-white">
                  <span>{exp.company || "Company"} &bull; {exp.location}</span>
                  <span className="font-normal text-[9px] text-slate-500">{exp.startDate} - {exp.endDate}</span>
                </div>
                <div className="text-[9.5px] italic font-semibold text-slate-600 dark:text-slate-400">
                  {exp.role || "Job Title"}
                </div>
                {exp.description && (
                  <p className="text-[9.5px] leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line pl-2">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="py-3 text-left">
          <h2 className="text-xs font-bold uppercase text-slate-955 dark:text-white border-b border-slate-300 pb-0.5 mb-2 tracking-wider">Education & Credentials</h2>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id || edu._id} className="space-y-0.5">
                <div className="flex justify-between items-baseline font-bold text-[10px] text-slate-900 dark:text-white">
                  <span>{edu.institution || edu.school || "University"}</span>
                  <span className="font-normal text-[9px] text-slate-500">{edu.startDate} - {edu.endDate}</span>
                </div>
                <div className="flex justify-between text-[9.5px] text-slate-600 dark:text-slate-400">
                  <span>{edu.degree || "Degree"} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}</span>
                  {edu.cgpa && <span>GPA: {edu.cgpa}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {displayProjects.length > 0 && (
        <div className="py-3 text-left">
          <h2 className="text-xs font-bold uppercase text-slate-955 dark:text-white border-b border-slate-300 pb-0.5 mb-2 tracking-wider">Key Projects</h2>
          <div className="space-y-2">
            {displayProjects.map((proj) => (
              <div key={proj.id || proj._id} className="space-y-0.5">
                <div className="flex justify-between items-baseline font-bold text-[10px] text-slate-900 dark:text-white">
                  <span>{proj.title || "Project Title"} {proj.technologies ? `(${Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies})` : ""}</span>
                  {proj.liveDemo && <span className="font-normal text-[8.5px] text-slate-500">{proj.liveDemo}</span>}
                </div>
                {proj.description && (
                  <p className="text-[9.5px] leading-relaxed text-slate-700 dark:text-slate-300 pl-2">
                    {proj.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="py-3 text-left">
          <h2 className="text-xs font-bold uppercase text-slate-955 dark:text-white border-b border-slate-300 pb-0.5 mb-1.5 tracking-wider">Core Proficiencies</h2>
          <p className="text-[9.5px] text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">
            {skills.join("  |  ")}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div 
      className={cn(
        "bg-white dark:bg-slate-955 p-8 shadow-md border border-slate-200 dark:border-slate-800 rounded-xs aspect-[1/1.4] transition-all duration-300 mx-auto select-text origin-top",
        "w-full max-w-[620px]"
      )}
      style={{ transform: `scale(${scale})` }}
    >
      {resumeData.template === "Classic Executive" ? renderExecutive() : renderMinimalist()}
    </div>
  );
}
