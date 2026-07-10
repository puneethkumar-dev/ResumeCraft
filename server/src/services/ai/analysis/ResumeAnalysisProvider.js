const { GoogleGenAI } = require('@google/genai');
const AnalysisPromptBuilder = require('./AnalysisPromptBuilder');
const AnalysisValidator = require('./AnalysisValidator');
const AILogger = require('../providers/AILogger');

/**
 * Gemini Provider implementation of the AI Analysis service.
 */
class ResumeAnalysisProvider {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    // Instantiate SDK only if we have a valid non-mock API key.
    if (this.apiKey && this.apiKey !== 'mock_gemini_key_for_now') {
      this.ai = new GoogleGenAI({ apiKey: this.apiKey });
    }
  }

  /**
   * Sends the resume data to Gemini, parses/validates the response, and handles retries.
   * @param {object} resumeDoc - The Mongoose resume document.
   * @param {string} userId - The authenticated user's ID.
   * @returns {Promise<object>} The validated JSON generated content.
   */
  async analyzeResume(resumeDoc, userId) {
    const startTime = Date.now();
    const resumeId = resumeDoc._id.toString();

    // Development/Test mock fallback
    if (!this.apiKey || this.apiKey === 'mock_gemini_key_for_now') {
      const mockResult = {
        overallScore: 82,
        atsScore: 78,
        grammarScore: 88,
        readabilityScore: 80,
        strengths: [
          "Well-structured Education and Projects sections.",
          "Good contact information accessibility.",
          "Consistent use of action verbs in project details."
        ],
        weaknesses: [
          "Professional summary is too generic and lacks modern industry positioning.",
          "Work experience entries are missing quantifiable metrics (e.g., %, $, hours).",
          "Skills list is missing core competencies related to target role."
        ],
        suggestions: [
          "Rewrite the professional summary to focus on target role engineering achievements.",
          "Quantify bullet points in work experience by detailing exact metric results (e.g. Sliced build times by 30%).",
          "Incorporate target role keywords in core skills."
        ],
        missingSkills: [
          "CI/CD",
          "TypeScript",
          "AWS Cloud",
          "Docker"
        ]
      };

      const duration = Date.now() - startTime;
      AILogger.log({
        resumeId,
        userId,
        provider: 'gemini-analysis (mock)',
        generationTime: duration,
        success: true
      });

      return mockResult;
    }

    const prompt = AnalysisPromptBuilder.build(resumeDoc);
    let attempts = 0;
    const maxAttempts = 2; // 1 initial call + 1 retry

    while (attempts < maxAttempts) {
      attempts++;
      try {
        const response = await this.ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json'
          }
        });

        const textResponse = typeof response.text === 'function' ? response.text() : response.text;
        const validatedJson = AnalysisValidator.parseAndValidate(textResponse);

        const duration = Date.now() - startTime;
        AILogger.log({
          resumeId,
          userId,
          provider: 'gemini-analysis',
          generationTime: duration,
          success: true
        });

        return validatedJson;
      } catch (error) {
        console.warn(`[ResumeAnalysisProvider] Attempt ${attempts} failed: ${error.message}`);

        if (attempts >= maxAttempts) {
          const duration = Date.now() - startTime;
          AILogger.log({
            resumeId,
            userId,
            provider: 'gemini-analysis',
            generationTime: duration,
            success: false,
            errorMessage: error.message
          });
          // Rethrow the error to be captured in ResumeAnalysisService / controller
          throw error;
        }
      }
    }
  }
}

module.exports = ResumeAnalysisProvider;
