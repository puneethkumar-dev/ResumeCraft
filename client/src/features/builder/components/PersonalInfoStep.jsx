import { useResumeForm } from "../../../contexts/ResumeFormContext";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { User, Mail, Phone, MapPin, Globe, Sparkles } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useState } from "react";
import { useToast } from "../../../contexts/ToastContext";

export default function PersonalInfoStep() {
  const { resumeData, updatePersonalInfo } = useResumeForm();
  const [aiGenerating, setAiGenerating] = useState(false);
  const { toast } = useToast();

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    updatePersonalInfo({ [name]: value });
  };

  const handleGenerateSummary = async () => {
    if (!resumeData.personalInfo?.title) {
      toast({
        variant: "warning",
        title: "Title Required",
        description: "Please enter your Target Job Title first to generate a tailored summary."
      });
      return;
    }
    setAiGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      const mockSummary = `Results-oriented ${resumeData.personalInfo.title} with a proven track record of designing, building, and deploying scalable software architectures. Passionate about optimization, clean code practices, and leading high-performing cross-functional agile teams to deliver impactful products that align with strategic business operations.`;
      updatePersonalInfo({ summary: mockSummary });
      toast({
        variant: "success",
        title: "AI Summary Generated",
        description: "A summary tailored for " + resumeData.personalInfo.title + " has been written."
      });
    } catch (err) {
      // ignore
    } finally {
      setAiGenerating(false);
    }
  };

  const info = resumeData?.personalInfo || {};

  return (
    <div className="space-y-6 text-left">
      <div>
        <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-1">Personal Details</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Introduce yourself and provide your primary contact info.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          name="name"
          placeholder="e.g. Puneeth Kumar"
          value={info.name || ""}
          onChange={handleFieldChange}
          icon={User}
        />
        <Input
          label="Target Job Title"
          name="title"
          placeholder="e.g. Senior Software Engineer"
          value={info.title || ""}
          onChange={handleFieldChange}
        />
        <Input
          label="Email Address"
          name="email"
          type="email"
          placeholder="e.g. puneeth@example.com"
          value={info.email || ""}
          onChange={handleFieldChange}
          icon={Mail}
        />
        <Input
          label="Phone Number"
          name="phone"
          placeholder="e.g. +91 9876543210"
          value={info.phone || ""}
          onChange={handleFieldChange}
          icon={Phone}
        />
        <Input
          label="Location"
          name="location"
          placeholder="e.g. Bangalore, India"
          value={info.location || ""}
          onChange={handleFieldChange}
          icon={MapPin}
        />
        <Input
          label="Website / portfolio Link"
          name="website"
          placeholder="e.g. github.com/puneeth"
          value={info.website || ""}
          onChange={handleFieldChange}
          icon={Globe}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Professional Summary
          </label>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGenerateSummary}
            loading={aiGenerating}
            className="text-violet-600 dark:text-violet-400 hover:text-violet-700 p-0 text-xs flex items-center gap-1"
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI Write Summary
          </Button>
        </div>
        <Textarea
          name="summary"
          placeholder="Describe your career goals, highlights, and primary strengths..."
          value={info.summary || ""}
          onChange={handleFieldChange}
          rows={5}
        />
      </div>
    </div>
  );
}
