const Resume = require('../../../models/Resume');
const ATSAnalysisProvider = require('./ATSAnalysisProvider');

/**
 * Service orchestrating ATS Analysis, validation, and database storage.
 */
class ATSAnalysisService {
  constructor(provider = new ATSAnalysisProvider()) {
    this.provider = provider;
  }

  /**
   * Evaluates a resume against a job description.
   * @param {string} resumeId - ID of the resume to evaluate.
   * @param {string} jobDescription - Job description text to compare.
   * @param {string} userId - Authenticated user's ID.
   * @returns {Promise<object>} Validation failures or successful ATS analysis details.
   */
  async analyzeATS(resumeId, jobDescription, userId) {
    // 1. Fetch Resume and verify ownership
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      const error = new Error('Resume not found');
      error.statusCode = 404;
      throw error;
    }

    if (resume.user.toString() !== userId.toString()) {
      const error = new Error('Not authorized to access this resume');
      error.statusCode = 403;
      throw error;
    }

    // 2. Perform Resume Validation
    const hasPersonalInfo = resume.personalInfo && 
      resume.personalInfo.fullName && resume.personalInfo.fullName.trim() &&
      resume.personalInfo.email && resume.personalInfo.email.trim();

    const hasSkills = resume.skills && resume.skills.length > 0 &&
      resume.skills.reduce((acc, s) => acc + (s.items?.length || 0), 0) > 0;

    const hasEducation = resume.education && resume.education.length > 0;
    const hasProjects = resume.projects && resume.projects.length > 0;
    const hasExperience = resume.experience && resume.experience.length > 0;
    const hasProjectsOrExperience = hasProjects || hasExperience;

    if (!hasPersonalInfo || !hasSkills || !hasEducation || !hasProjectsOrExperience) {
      let message = 'Complete your resume before ATS analysis.';
      if (!hasPersonalInfo) message = 'Provide your full name and email in Personal Info.';
      else if (!hasSkills) message = 'Add at least one skill to your profile.';
      else if (!hasEducation) message = 'Add at least one education record.';
      else message = 'Add at least one project or work experience entry.';

      return {
        status: 'incomplete_resume',
        message
      };
    }

    // 3. Perform Job Description Validation
    if (!this.isValidJobDescription(jobDescription)) {
      return {
        status: 'invalid_job_description',
        message: 'Please provide a valid job description.'
      };
    }

    // 4. Run comparison through AI Provider with a 30s timeout
    let analysisResult;
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => {
          const timeoutError = new Error('ATS analysis timed out');
          timeoutError.statusCode = 504;
          reject(timeoutError);
        }, 30000)
      );

      analysisResult = await Promise.race([
        this.provider.analyzeATS(resume, jobDescription),
        timeoutPromise
      ]);
    } catch (error) {
      if (error.statusCode) {
        throw error;
      }
      const genericError = new Error(error.message || 'ATS analysis process failed');
      genericError.statusCode = 500;
      throw genericError;
    }

    // 5. Handle if Gemini detected invalid job description (double-check fallback)
    if (analysisResult.status === 'invalid_job_description') {
      return {
        status: 'invalid_job_description',
        message: analysisResult.message || 'Please provide a valid job description.'
      };
    }

    // 6. Save the score back to the resume document
    resume.atsScore = analysisResult.overallScore || 0;
    await resume.save();

    return {
      status: 'success',
      ...analysisResult
    };
  }

  /**
   * Evaluates the validity of a job description.
   * @param {string} jd - Job description input.
   * @returns {boolean} True if valid.
   */
  isValidJobDescription(jd) {
    if (!jd || typeof jd !== 'string') return false;
    const trimmed = jd.trim();
    if (trimmed.length < 100) return false;

    // Check vocabulary diversity (unique words ratio) to filter repetitive sequences
    // Focus on words of length 3 or more to filter "the", "a", etc.
    const words = trimmed.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
    if (words.length > 0) {
      const uniqueWords = new Set(words);
      const ratio = uniqueWords.size / words.length;
      // If words are highly repeated (e.g. repeated block copy-paste)
      if (ratio < 0.25 && words.length > 15) {
        return false;
      }
    }

    // Check for repetitive consecutive loops (e.g. "abcd abcd abcd")
    if (/(\b\w+\b)( \1){3,}/i.test(trimmed)) {
      return false;
    }

    // Check for standard professional/industry keywords
    const professionalRegex = /\b(experience|skills?|qualified|requirements?|responsibilit(ies|y)|developer|engineer|designer|manager|architect|analyst|specialist|lead|officer|bachelor|degree|education|tech(nology|nical)?|programming|coding|software|system|application|database|tools|frameworks?|certificat(ion|e)|degree|university|science|business|marketing|sales|operations?|finance|product|project)\b/i;
    if (!professionalRegex.test(trimmed)) {
      return false;
    }

    return true;
  }
}

module.exports = ATSAnalysisService;
