import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "./ToastContext";
import resumeApi from "../api/resumeApi";

const ResumeFormContext = createContext(null);

const emptyResumeState = {
  title: "My New Resume",
  targetRole: "Software Engineer",
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
  achievements: []
};

export function ResumeFormProvider({ children }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);

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

          setResumeData({
            ...emptyResumeState,
            ...item,
            id: item._id, // Map database _id to local id variable
            skills: flatSkills,
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

  // Autosave to backend database
  const saveResume = useCallback(async (updatedData) => {
    if (!id || !updatedData) return;

    // Instantly calculate completion and set local react state to keep UI responsive
    const completion = calculateCompletion(updatedData);
    const finalData = {
      ...updatedData,
      completion
    };
    setResumeData(finalData);

    try {
      const payload = { ...finalData };
      // Strip automatically generated fields and local id mapping to prevent Mongoose validation warnings
      delete payload._id;
      delete payload.user;
      delete payload.createdAt;
      delete payload.updatedAt;
      delete payload.id;
      
      const finalSkills = Array.isArray(finalData.skills)
        ? [{ category: "Core Skills", items: finalData.skills }]
        : [];
      payload.skills = finalSkills;

      await resumeApi.update(id, payload);
    } catch (err) {
      console.error("Autosave to database failed:", err);
    }
  }, [id]);

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
        saveResume
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
