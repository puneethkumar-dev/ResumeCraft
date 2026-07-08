import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "./ToastContext";

const ResumeFormContext = createContext(null);

const RESUMES_KEY = "resumecraft_resumes";

const emptyResumeState = {
  title: "My New Resume",
  targetRole: "Software Engineer",
  template: "Modern Minimalist",
  completion: 10,
  atsScore: 0,
  personalInfo: {
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    summary: ""
  },
  experience: [],
  education: [],
  projects: [],
  skills: [], // array of strings or { category, items: [] }
  certifications: [],
  languages: []
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
    if (!id) {
      setLoading(true);
      const localData = localStorage.getItem(RESUMES_KEY);
      const list = localData ? JSON.parse(localData) : [];
      
      if (list.length > 0) {
        // Sort by lastModified descending to find most recently edited resume
        const sorted = [...list].sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
        navigate(`/builder/${sorted[0].id}`, { replace: true });
      } else {
        // Auto-create a default resume
        const newId = "res-" + Math.random().toString(36).substring(2, 9);
        const newResume = {
          ...emptyResumeState,
          id: newId,
          title: "My New Resume",
          lastModified: new Date().toISOString()
        };
        localStorage.setItem(RESUMES_KEY, JSON.stringify([newResume]));
        navigate(`/builder/${newId}`, { replace: true });
      }
      return;
    }

    setLoading(true);
    const localData = localStorage.getItem(RESUMES_KEY);
    const list = localData ? JSON.parse(localData) : [];
    const item = list.find((r) => r.id === id);

    if (item) {
      // Ensure default properties are present if they were absent
      setResumeData({
        ...emptyResumeState,
        ...item,
        personalInfo: { ...emptyResumeState.personalInfo, ...(item.personalInfo || {}) }
      });
    } else {
      toast({
        variant: "danger",
        title: "Resume Not Found",
        description: "Returning to your dashboard."
      });
      navigate("/dashboard");
    }
    setLoading(false);
  }, [id, navigate, toast]);

  // Compute form completion percentage
  const calculateCompletion = (data) => {
    let score = 0;
    let total = 6; // PersonalInfo, Summary, Experience, Education, Projects, Skills

    if (data.personalInfo?.name && data.personalInfo?.email) score += 1;
    if (data.personalInfo?.summary) score += 1;
    if (data.experience?.length > 0) score += 1;
    if (data.education?.length > 0) score += 1;
    if (data.projects?.length > 0) score += 1;
    if (data.skills?.length > 0) score += 1;

    return Math.round((score / total) * 100);
  };

  // Autosave to localStorage
  const saveResume = useCallback((updatedData) => {
    if (!id || !updatedData) return;

    // Calculate completion score dynamically
    const completion = calculateCompletion(updatedData);
    const finalData = {
      ...updatedData,
      completion,
      lastModified: new Date().toISOString()
    };

    setResumeData(finalData);

    const localData = localStorage.getItem(RESUMES_KEY);
    const list = localData ? JSON.parse(localData) : [];
    const index = list.findIndex((r) => r.id === id);
    
    if (index !== -1) {
      list[index] = finalData;
      localStorage.setItem(RESUMES_KEY, JSON.stringify(list));
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
      if (item.id === itemId) {
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
      [key]: (resumeData[key] || []).filter((item) => item.id !== itemId)
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
