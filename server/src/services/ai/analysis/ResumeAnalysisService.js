const Resume = require('../../../models/Resume');
const ResumeAnalysisProvider = require('./ResumeAnalysisProvider');

/**
 * Provider-independent ResumeAnalysisService layer containing AI business logic,
 * authentication checks, and timeout handling.
 */
class ResumeAnalysisService {
  /**
   * Initializes the ResumeAnalysisService with a specific AI provider.
   * Defaults to ResumeAnalysisProvider.
   * @param {object} [provider]
   */
  constructor(provider = new ResumeAnalysisProvider()) {
    this.provider = provider;
  }

  /**
   * Processes the AI resume analysis with 30s timeout and ownership checks.
   * @param {string} resumeId - The ID of the resume to analyze.
   * @param {string} userId - The authenticated user's ID.
   * @returns {Promise<object>} The generated analysis object.
   */
  async analyzeResume(resumeId, userId) {
    const resume = await Resume.findById(resumeId);

    // 1. Check if resume exists
    if (!resume) {
      const error = new Error('Resume not found');
      error.statusCode = 404;
      throw error;
    }

    // 2. Verify resume ownership
    if (resume.user.toString() !== userId.toString()) {
      const error = new Error('Not authorized to access this resume');
      error.statusCode = 403;
      throw error;
    }

    let analysisData;

    try {
      // 30 seconds timeout promise
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => {
          const timeoutError = new Error('AI analysis request timed out');
          timeoutError.statusCode = 504; // 504 Gateway Timeout
          reject(timeoutError);
        }, 30000)
      );

      // Race provider call against the timeout
      analysisData = await Promise.race([
        this.provider.analyzeResume(resume, userId),
        timeoutPromise
      ]);
    } catch (error) {
      if (error.statusCode) {
        throw error;
      }
      const genericError = new Error(error.message || 'AI analysis failed');
      genericError.statusCode = 500;
      throw genericError;
    }

    // 3. Save only analysis to the database
    resume.analysis = analysisData;
    await resume.save();

    return resume.analysis;
  }
}

module.exports = ResumeAnalysisService;
