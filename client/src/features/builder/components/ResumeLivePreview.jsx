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

  const distributeContent = () => {
    const pages = [];
    let currentPage = {
      showHeader: true,
      showSummary: !!displaySummary,
      experience: [],
      education: [],
      projects: [],
      showSkills: false,
      continueExperience: false,
      continueEducation: false,
      continueProjects: false,
    };

    let currentHeight = 0;
    
    // Header
    currentHeight += 160;
    
    // Summary
    if (displaySummary) {
      currentHeight += Math.max(60, Math.ceil(displaySummary.length / 2.5)) + 16;
    }

    // Experience
    if (displayExperience && displayExperience.length > 0) {
      currentHeight += 40; // Section header
      displayExperience.forEach((exp) => {
        let itemHeight = 60;
        if (exp.description) {
          itemHeight += Math.max(20, Math.ceil(exp.description.length / 2));
        }
        
        if (currentHeight + itemHeight > 960) {
          pages.push(currentPage);
          currentPage = {
            showHeader: false,
            showSummary: false,
            experience: [exp],
            education: [],
            projects: [],
            showSkills: false,
            continueExperience: true,
            continueEducation: false,
            continueProjects: false,
          };
          currentHeight = 40 + itemHeight;
        } else {
          currentPage.experience.push(exp);
          currentHeight += itemHeight;
        }
      });
    }

    // Education
    if (education && education.length > 0) {
      let headingHeight = 40;
      if (currentHeight + headingHeight + 60 > 960) {
        pages.push(currentPage);
        currentPage = {
          showHeader: false,
          showSummary: false,
          experience: [],
          education: [],
          projects: [],
          showSkills: false,
          continueExperience: false,
          continueEducation: false,
          continueProjects: false,
        };
        currentHeight = 0;
      }
      
      currentHeight += headingHeight;
      
      education.forEach((edu) => {
        let itemHeight = 60;
        if (currentHeight + itemHeight > 960) {
          pages.push(currentPage);
          currentPage = {
            showHeader: false,
            showSummary: false,
            experience: [],
            education: [edu],
            projects: [],
            showSkills: false,
            continueExperience: false,
            continueEducation: true,
            continueProjects: false,
          };
          currentHeight = 40 + itemHeight;
        } else {
          currentPage.education.push(edu);
          currentHeight += itemHeight;
        }
      });
    }

    // Projects
    if (displayProjects && displayProjects.length > 0) {
      let headingHeight = 40;
      if (currentHeight + headingHeight + 80 > 960) {
        pages.push(currentPage);
        currentPage = {
          showHeader: false,
          showSummary: false,
          experience: [],
          education: [],
          projects: [],
          showSkills: false,
          continueExperience: false,
          continueEducation: false,
          continueProjects: false,
        };
        currentHeight = 0;
      }
      
      currentHeight += headingHeight;
      
      displayProjects.forEach((proj) => {
        let itemHeight = 60;
        if (proj.description) {
          itemHeight += Math.max(20, Math.ceil(proj.description.length / 2));
        }
        
        if (currentHeight + itemHeight > 960) {
          pages.push(currentPage);
          currentPage = {
            showHeader: false,
            showSummary: false,
            experience: [],
            education: [],
            projects: [proj],
            showSkills: false,
            continueExperience: false,
            continueEducation: false,
            continueProjects: true,
          };
          currentHeight = 40 + itemHeight;
        } else {
          currentPage.projects.push(proj);
          currentHeight += itemHeight;
        }
      });
    }

    // Skills
    if (skills && skills.length > 0) {
      let headingHeight = 35;
      let skillsHeight = Math.max(40, Math.ceil(skills.length * 4));
      
      if (currentHeight + headingHeight + skillsHeight > 960) {
        pages.push(currentPage);
        currentPage = {
          showHeader: false,
          showSummary: false,
          experience: [],
          education: [],
          projects: [],
          showSkills: true,
          continueExperience: false,
          continueEducation: false,
          continueProjects: false,
        };
        currentHeight = headingHeight + skillsHeight;
      } else {
        currentPage.showSkills = true;
        currentHeight += headingHeight + skillsHeight;
      }
    }

    pages.push(currentPage);
    return pages;
  };

  // Modern Minimalist Template Rendering
  const renderMinimalistPage = (pageData, pageNumber, totalPages) => (
    <div className="text-left font-sans text-slate-800 dark:text-slate-200 h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        {pageData.showHeader && (
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
        )}

        {/* Summary */}
        {pageData.showSummary && displaySummary && (
          <div className="py-4 border-b border-slate-100">
            <h2 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-widest mb-1.5">Profile</h2>
            <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-350">{displaySummary}</p>
          </div>
        )}

        {/* Experience */}
        {pageData.experience.length > 0 && (
          <div className="py-4 border-b border-slate-100">
            <h2 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-widest mb-3">
              {pageData.continueExperience ? "Experience (Continued)" : "Experience"}
            </h2>
            <div className="space-y-4">
              {pageData.experience.map((exp) => (
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
        {pageData.education.length > 0 && (
          <div className="py-4 border-b border-slate-100">
            <h2 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-widest mb-3">
              {pageData.continueEducation ? "Education (Continued)" : "Education"}
            </h2>
            <div className="space-y-3">
              {pageData.education.map((edu) => (
                <div key={edu.id || edu._id} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                      {edu.degree || "Degree"} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-semibold">{edu.startDate} - {edu.endDate}</span>
                  </div>
                  <div className="flex justify-between items-baseline text-[10px] text-slate-500 font-semibold">
                    <span>{edu.institution || edu.school || "University"}</span>
                    {(edu.cgpa || edu.gpa) && <span>GPA: {edu.cgpa || edu.gpa}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {pageData.projects.length > 0 && (
          <div className="py-4 border-b border-slate-100">
            <h2 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-widest mb-3">
              {pageData.continueProjects ? "Projects (Continued)" : "Projects"}
            </h2>
            <div className="space-y-3">
              {pageData.projects.map((proj) => (
                <div key={proj.id || proj._id} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">{proj.title || proj.name || "Project Title"}</h3>
                    {(proj.liveDemo || proj.link) && <span className="text-[9px] text-violet-500 lowercase font-medium">{proj.liveDemo || proj.link}</span>}
                  </div>
                  {proj.technologies && (
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                      {Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}
                    </p>
                  )}
                  {proj.description && (
                    <p className="text-[10px] leading-relaxed text-slate-650 dark:text-slate-350 whitespace-pre-line">
                      {proj.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {pageData.showSkills && skills.length > 0 && (
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

      {/* Page Footer / Number Indicator */}
      <div className="flex justify-between items-center text-[9px] text-slate-400 border-t border-slate-100 pt-2 mt-4">
        <span>Generated by ResumeCraft</span>
        <span>Page {pageNumber} of {totalPages}</span>
      </div>
    </div>
  );

  // Classic Executive Template Rendering
  const renderExecutivePage = (pageData, pageNumber, totalPages) => (
    <div className="text-center font-serif text-slate-800 dark:text-slate-200 h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        {pageData.showHeader && (
          <div className="border-b border-double border-slate-300 pb-4">
            <h1 className="text-2xl font-bold tracking-wide text-slate-955 dark:text-white leading-none">
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
        )}

        {/* Summary */}
        {pageData.showSummary && displaySummary && (
          <div className="py-3 text-left">
            <h2 className="text-xs font-bold uppercase text-slate-955 dark:text-white border-b border-slate-300 pb-0.5 mb-1.5 tracking-wider">Executive Profile</h2>
            <p className="text-[10px] italic leading-relaxed text-slate-700 dark:text-slate-300">{displaySummary}</p>
          </div>
        )}

        {/* Experience */}
        {pageData.experience.length > 0 && (
          <div className="py-3 text-left">
            <h2 className="text-xs font-bold uppercase text-slate-955 dark:text-white border-b border-slate-300 pb-0.5 mb-2 tracking-wider">
              {pageData.continueExperience ? "Professional Experience (Continued)" : "Professional Experience"}
            </h2>
            <div className="space-y-3">
              {pageData.experience.map((exp) => (
                <div key={exp.id || exp._id} className="space-y-0.5">
                  <div className="flex justify-between items-baseline font-bold text-[10px] text-slate-900 dark:text-white">
                    <span>{exp.company || "Company"} &bull; {exp.location}</span>
                    <span className="font-normal text-[9px] text-slate-500">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <div className="text-[9.5px] italic font-semibold text-slate-600 dark:text-slate-400">
                    {exp.role || "Job Title"}
                  </div>
                  {exp.description && (
                    <p className="text-[9.5px] leading-relaxed text-slate-705 dark:text-slate-300 whitespace-pre-line pl-2">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {pageData.education.length > 0 && (
          <div className="py-3 text-left">
            <h2 className="text-xs font-bold uppercase text-slate-955 dark:text-white border-b border-slate-300 pb-0.5 mb-2 tracking-wider">
              {pageData.continueEducation ? "Education & Credentials (Continued)" : "Education & Credentials"}
            </h2>
            <div className="space-y-2">
              {pageData.education.map((edu) => (
                <div key={edu.id || edu._id} className="space-y-0.5">
                  <div className="flex justify-between items-baseline font-bold text-[10px] text-slate-900 dark:text-white">
                    <span>{edu.institution || edu.school || "University"}</span>
                    <span className="font-normal text-[9px] text-slate-500">{edu.startDate} - {edu.endDate}</span>
                  </div>
                  <div className="flex justify-between text-[9.5px] text-slate-600 dark:text-slate-400">
                    <span>{edu.degree || "Degree"} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}</span>
                    {(edu.cgpa || edu.gpa) && <span>GPA: {edu.cgpa || edu.gpa}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {pageData.projects.length > 0 && (
          <div className="py-3 text-left">
            <h2 className="text-xs font-bold uppercase text-slate-955 dark:text-white border-b border-slate-300 pb-0.5 mb-2 tracking-wider">
              {pageData.continueProjects ? "Key Projects (Continued)" : "Key Projects"}
            </h2>
            <div className="space-y-2">
              {pageData.projects.map((proj) => (
                <div key={proj.id || proj._id} className="space-y-0.5">
                  <div className="flex justify-between items-baseline font-bold text-[10px] text-slate-900 dark:text-white">
                    <span>{proj.title || proj.name || "Project Title"} {proj.technologies ? `(${Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies})` : ""}</span>
                    {(proj.liveDemo || proj.link) && <span className="font-normal text-[8.5px] text-slate-505">{proj.liveDemo || proj.link}</span>}
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
        {pageData.showSkills && skills.length > 0 && (
          <div className="py-3 text-left">
            <h2 className="text-xs font-bold uppercase text-slate-955 dark:text-white border-b border-slate-300 pb-0.5 mb-1.5 tracking-wider">Core Proficiencies</h2>
            <p className="text-[9.5px] text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">
              {skills.join("  |  ")}
            </p>
          </div>
        )}
      </div>

      {/* Page Footer / Number Indicator */}
      <div className="flex justify-between items-center text-[9px] text-slate-400 border-t border-slate-200 pt-2 mt-4">
        <span>Generated by ResumeCraft</span>
        <span>Page {pageNumber} of {totalPages}</span>
      </div>
    </div>
  );

  const pages = distributeContent();

  return (
    <div className="flex flex-col gap-6 w-fit min-w-full items-center select-text py-4">
      {pages.map((pageData, index) => (
        <div 
          key={index}
          className="overflow-hidden mx-auto shrink-0 shadow-lg border border-slate-200 dark:border-slate-800 rounded-xs bg-white dark:bg-slate-955"
          style={{ 
            width: `${794 * scale}px`, 
            height: `${1123 * scale}px` 
          }}
        >
          <div 
            className={cn(
              "bg-white dark:bg-slate-950 p-10 relative overflow-hidden select-text origin-top-left shrink-0 transition-all duration-300",
              "w-[794px] h-[1123px]"
            )}
            style={{ 
              transform: `scale(${scale})`,
            }}
          >
            {resumeData.template === "Classic Executive" 
              ? renderExecutivePage(pageData, index + 1, pages.length) 
              : renderMinimalistPage(pageData, index + 1, pages.length)}
          </div>
        </div>
      ))}
    </div>
  );
}
