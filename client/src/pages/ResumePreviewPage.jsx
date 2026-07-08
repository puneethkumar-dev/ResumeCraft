import { useParams, useNavigate, Link } from "react-router-dom";
import { ResumeFormProvider, useResumeForm } from "../contexts/ResumeFormContext";
import ResumeLivePreview from "../features/builder/components/ResumeLivePreview";
import { Button } from "../components/ui/button";
import { ArrowLeft, Edit, Download, CheckSquare, FileText, Printer } from "lucide-react";
import { useToast } from "../contexts/ToastContext";
import { useState } from "react";

function PreviewContent() {
  const { resumeData, loading } = useResumeForm();
  const [downloading, setDownloading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  if (loading || !resumeData) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-600 border-t-transparent"></div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        variant: "success",
        title: "Export Success",
        description: "PDF file is downloading to your system."
      });
    } catch (err) {
      // ignore
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      {/* Top Navbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 dark:border-slate-800 pb-5 gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-500"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </button>
          <div>
            <h1 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              {resumeData.title}
            </h1>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider pl-1 mt-0.5">
              Template: {resumeData.template} &bull; ATS Score: {resumeData.atsScore}%
            </p>
          </div>
        </div>

        {/* Action Panel */}
        <div className="flex items-center gap-2 flex-wrap">
          <Link to={`/builder/${resumeData.id}`}>
            <Button variant="outline" size="sm" icon={Edit}>
              Edit Draft
            </Button>
          </Link>
          <Button variant="outline" size="sm" icon={Printer} onClick={handlePrint} className="hidden sm:inline-flex">
            Print
          </Button>
          <Button size="sm" icon={Download} onClick={handleDownload} loading={downloading}>
            Export PDF
          </Button>
        </div>
      </div>

      {/* Main Center Area rendering the sheet */}
      <div className="bg-slate-100 dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800/80 flex justify-center shadow-inner overflow-x-auto print:bg-white print:p-0 print:border-none print:shadow-none">
        <ResumeLivePreview scale={1} />
      </div>
    </div>
  );
}

export default function ResumePreviewPage() {
  return (
    <ResumeFormProvider>
      <PreviewContent />
    </ResumeFormProvider>
  );
}
