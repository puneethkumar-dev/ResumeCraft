const Resume = require('../../models/Resume');
const GeminiProvider = require('./providers/GeminiProvider');

/**
 * Provider-independent AIService layer containing AI business logic,
 * authentication checks, and timeout handling.
 */
class AIService {
  /**
   * Initializes the AIService with a specific AI provider.
   * Defaults to GeminiProvider.
   * @param {object} [provider]
   */
  constructor(provider = new GeminiProvider()) {
    this.provider = provider;
  }

  /**
   * Processes the AI resume generation with 30s timeout and ownership checks.
   * @param {string} resumeId - The ID of the resume to optimize.
   * @param {string} userId - The authenticated user's ID.
   * @returns {Promise<object>} The generatedContent object and resumeId.
   */
  async generateResume(resumeId, userId) {
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

    let generatedData;

    try {
      // 30 seconds timeout promise
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => {
          const timeoutError = new Error('AI request timed out');
          timeoutError.statusCode = 504; // 504 Gateway Timeout
          reject(timeoutError);
        }, 30000)
      );

      // Race provider call against the timeout
      generatedData = await Promise.race([
        this.provider.generateResume(resume, userId),
        timeoutPromise
      ]);
    } catch (error) {
      if (error.statusCode) {
        throw error;
      }
      const genericError = new Error(error.message || 'AI generation failed');
      genericError.statusCode = 500;
      throw genericError;
    }

    // 3. Save only generatedContent to the database
    resume.generatedContent = {
      summary: generatedData.summary,
      experience: generatedData.experience,
      projects: generatedData.projects,
      metadata: generatedData.metadata
    };

    await resume.save();

    return {
      resumeId: resume._id.toString(),
      generatedContent: resume.generatedContent
    };
  }
}

module.exports = AIService;
