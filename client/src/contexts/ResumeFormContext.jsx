import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "./ToastContext";
import resumeApi from "../api/resumeApi";

const ResumeFormContext = createContext(null);

const emptyResumeState = {
  title: "",
  targetRole: "",
  template: "Modern Minimalist",
  completion: 10,
  atsScore: 0,
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    portfolio: "",
    linkedin: "",
    github: ""
  },
  summary: "",
  experience: [],
  education: [],
  projects: [],
  skills: [], // array of objects matching { category, items: [] }
  certifications: [],
  achievements: [],
  languages: [],
  interests: [],
  volunteerExperience: [],
  publications: [],
  analysis: null
};

export function ResumeFormProvider({ children }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [autosaveStatus, setAutosaveStatus] = useState("saved"); // 'saved' | 'saving' | 'unsaved'

  const timeoutRef = useRef(null);
  const pendingChangesRef = useRef(null);

  // Load resume data
  useEffect(() => {
    const loadResume = async () => {
      if (!id) {
        setLoading(true);
        try {
          const response = await resumeApi.getAll();
          const list = response.data || [];
          if (list.length > 0) {
            // Sort by updatedAt descending to find most recently edited resume
            const sorted = [...list].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            navigate(`/builder/${sorted[0]._id}`, { replace: true });
          } else {
            // Auto-create a default resume on the backend
            const responseCreate = await resumeApi.create({
              ...emptyResumeState,
              title: "My New Resume"
            });
            const newResumeId = responseCreate.data._id;
            navigate(`/builder/${newResumeId}`, { replace: true });
          }
        } catch (err) {
          toast({
            variant: "danger",
            title: "Error Loading Resumes",
            description: "Could not fetch your resumes from the server."
          });
          navigate("/dashboard");
        }
        return;
      }

      setLoading(true);
      try {
        const response = await resumeApi.getById(id);
        if (response.success && response.data) {
          const item = response.data;
          
          const fetchedSkills = item.skills || [];
          let flatSkills = [];
          if (fetchedSkills.length > 0) {
            if (typeof fetchedSkills[0] === 'string') {
              flatSkills = fetchedSkills;
            } else {
              flatSkills = fetchedSkills.reduce((acc, cat) => {
                return acc.concat(cat.items || []);
              }, []);
            }
          }

          const mappedExperience = (item.experience || []).map(exp => ({
            ...exp,
            id: exp._id || exp.id
          }));

          const mappedEducation = (item.education || []).map(edu => ({
            ...edu,
            id: edu._id || edu.id,
            school: edu.institution || edu.school || "",
            gpa: edu.cgpa || edu.gpa || ""
          }));

          const mappedProjects = (item.projects || []).map(proj => ({
            ...proj,
            id: proj._id || proj.id,
            name: proj.title || proj.name || "",
            link: proj.liveDemo || proj.github || proj.link || "",
            technologies: Array.isArray(proj.technologies) ? proj.technologies.join(", ") : (proj.technologies || "")
          }));

          const mappedCertifications = (item.certifications || []).map(cert => ({
            ...cert,
            id: cert._id || cert.id
          }));

          const mappedAchievements = (item.achievements || []).map(ach => ({
            ...ach,
            id: ach._id || ach.id
          }));

          const mappedLanguages = (item.languages || []).map(lang => ({
            ...lang,
            id: lang._id || lang.id
          }));

          const mappedVolunteer = (item.volunteerExperience || []).map(vol => ({
            ...vol,
            id: vol._id || vol.id
          }));

          const mappedPublications = (item.publications || []).map(pub => ({
            ...pub,
            id: pub._id || pub.id
          }));

          const mappedInterests = (item.interests || []).map((interest, idx) => ({
            id: `interest-${idx}`,
            name: interest
          }));

          setResumeData({
            ...emptyResumeState,
            ...item,
            id: item._id, // Map database _id to local id variable
            skills: flatSkills,
            experience: mappedExperience,
            education: mappedEducation,
            projects: mappedProjects,
            certifications: mappedCertifications,
            achievements: mappedAchievements,
            languages: mappedLanguages,
            interests: mappedInterests,
            volunteerExperience: mappedVolunteer,
            publications: mappedPublications,
            analysis: item.analysis || null,
            personalInfo: { ...emptyResumeState.personalInfo, ...(item.personalInfo || {}) }
          });
        } else {
          throw new Error("Resume not found");
        }
      } catch (err) {
        toast({
          variant: "danger",
          title: "Resume Not Found",
          description: "Returning to your dashboard."
        });
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadResume();
  }, [id, navigate, toast]);

  // Compute form completion percentage
  const calculateCompletion = (data) => {
    let score = 0;
    let total = 6; // PersonalInfo, Summary, Experience, Education, Projects, Skills

    if (data.personalInfo?.fullName && data.personalInfo?.email) score += 1;
    if (data.summary) score += 1;
    if (data.experience?.length > 0) score += 1;
    if (data.education?.length > 0) score += 1;
    if (data.projects?.length > 0) score += 1;
    if (data.skills?.length > 0) score += 1;

    return Math.round((score / total) * 100);
  };

  // Helper to build clean API payload
  const buildPayload = useCallback((dataToSave) => {
    const payload = { ...dataToSave };
    delete payload._id;
    delete payload.user;
    delete payload.createdAt;
    delete payload.updatedAt;
    delete payload.id;
    
    payload.skills = Array.isArray(dataToSave.skills)
      ? [{ category: "Core Skills", items: dataToSave.skills }]
      : [];

    if (payload.experience) {
      payload.experience = payload.experience.map(exp => {
        const item = { ...exp };
        if (item._id) delete item.id;
        return item;
      });
    }

    if (payload.education) {
      payload.education = payload.education.map(edu => {
        const item = {
          ...edu,
          institution: edu.school || edu.institution || "",
          cgpa: edu.gpa || edu.cgpa || ""
        };
        delete item.school;
        delete item.gpa;
        if (item._id) delete item.id;
        return item;
      });
    }

    if (payload.projects) {
      payload.projects = payload.projects.map(proj => {
        const item = {
          ...proj,
          title: proj.name || proj.title || "",
          liveDemo: proj.link || proj.liveDemo || "",
          technologies: typeof proj.technologies === 'string'
            ? proj.technologies.split(',').map(t => t.trim()).filter(Boolean)
            : (Array.isArray(proj.technologies) ? proj.technologies : [])
        };
        delete item.name;
        delete item.link;
        if (item._id) delete item.id;
        return item;
      });
    }

    if (payload.certifications) {
      payload.certifications = payload.certifications.map(c => {
        const item = { ...c };
        if (item._id) delete item.id;
        return item;
      });
    }

    if (payload.achievements) {
      payload.achievements = payload.achievements.map(a => {
        const item = { ...a };
        if (item._id) delete item.id;
        return item;
      });
    }

    if (payload.languages) {
      payload.languages = payload.languages.map(l => {
        const item = { ...l };
        if (item._id) delete item.id;
        return item;
      });
    }

    if (payload.volunteerExperience) {
      payload.volunteerExperience = payload.volunteerExperience.map(v => {
        const item = { ...v };
        if (item._id) delete item.id;
        return item;
      });
    }

    if (payload.publications) {
      payload.publications = payload.publications.map(p => {
        const item = { ...p };
        if (item._id) delete item.id;
        return item;
      });
    }

    if (payload.interests) {
      payload.interests = payload.interests
        .map(i => typeof i === 'string' ? i : i.name)
        .filter(Boolean);
    }

    return payload;
  }, []);

  // Synchronous/immediate save flush function
  const flushSave = useCallback(async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (!pendingChangesRef.current) return;

    const dataToSave = pendingChangesRef.current;
    pendingChangesRef.current = null;
    setAutosaveStatus("saving");

    try {
      const payload = buildPayload(dataToSave);
      await resumeApi.update(id, payload);
      setAutosaveStatus("saved");
    } catch (err) {
      console.error("Autosave database write failed:", err);
      setAutosaveStatus("unsaved");
    }
  }, [id, buildPayload]);

  // Autosave function that queues changes
  const saveResume = useCallback((updatedData) => {
    if (!id || !updatedData) return;

    // Calculate completion and set state instantly so live preview is responsive
    const completion = calculateCompletion(updatedData);
    const finalData = {
      ...updatedData,
      completion
    };
    setResumeData(finalData);
    setAutosaveStatus("unsaved");
    pendingChangesRef.current = finalData;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      flushSave();
    }, 1000);
  }, [id, flushSave]);

  // Flush on unmount to make sure no updates are left in memory
  useEffect(() => {
    return () => {
      if (pendingChangesRef.current) {
        const dataToSave = pendingChangesRef.current;
        pendingChangesRef.current = null;
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        const runUnmountSave = async () => {
          try {
            const payload = buildPayload(dataToSave);
            await resumeApi.update(id, payload);
          } catch (err) {
            console.error("Autosave cleanup write failed:", err);
          }
        };
        runUnmountSave();
      }
    };
  }, [id, buildPayload]);

  const updatePersonalInfo = (fields) => {
    const updated = {
      ...resumeData,
      personalInfo: {
        ...resumeData.personalInfo,
        ...fields
      }
    };
    saveResume(updated);
  };

  const updateGeneralFields = (fields) => {
    const updated = {
      ...resumeData,
      ...fields
    };
    saveResume(updated);
  };

  // Generic List Management Helpers
  const addListItem = (key, defaultObj) => {
    const updated = {
      ...resumeData,
      [key]: [...(resumeData[key] || []), { id: "item-" + Math.random().toString(36).substring(2, 9), ...defaultObj }]
    };
    saveResume(updated);
  };

  const updateListItem = (key, itemId, fields) => {
    const updatedList = (resumeData[key] || []).map((item) => {
      if (item._id === itemId || item.id === itemId) {
        return { ...item, ...fields };
      }
      return item;
    });

    const updated = {
      ...resumeData,
      [key]: updatedList
    };
    saveResume(updated);
  };

  const removeListItem = (key, itemId) => {
    const updated = {
      ...resumeData,
      [key]: (resumeData[key] || []).filter((item) => item._id !== itemId && item.id !== itemId)
    };
    saveResume(updated);
  };

  // Skills handlers
  const updateSkills = (skillsArray) => {
    const updated = {
      ...resumeData,
      skills: skillsArray
    };
    saveResume(updated);
  };

  const updateGeneratedContent = (generatedContent) => {
    setResumeData(prev => ({
      ...prev,
      generatedContent
    }));
  };

  const updateAnalysis = (analysis) => {
    setResumeData(prev => ({
      ...prev,
      analysis
    }));
  };

  const resetForm = () => {
    const updated = {
      ...resumeData,
      ...emptyResumeState,
      title: resumeData?.title || "My New Resume",
      id: resumeData?.id
    };
    saveResume(updated);
    setActiveStep(0);
    toast({
      variant: "info",
      title: "Form Reset",
      description: "Form contents have been cleared."
    });
  };

  return (
    <ResumeFormContext.Provider
      value={{
        resumeData,
        loading,
        activeStep,
        setActiveStep,
        updatePersonalInfo,
        updateGeneralFields,
        addListItem,
        updateListItem,
        removeListItem,
        updateSkills,
        resetForm,
        saveResume,
        updateGeneratedContent,
        updateAnalysis,
        autosaveStatus,
        flushSave
      }}
    >
      {children}
    </ResumeFormContext.Provider>
  );
}

export function useResumeForm() {
  const context = useContext(ResumeFormContext);
  if (!context) {
    throw new Error("useResumeForm must be used within a ResumeFormProvider");
  }
  return context;
}
