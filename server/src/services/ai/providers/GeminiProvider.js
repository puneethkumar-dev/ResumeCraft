const { GoogleGenAI } = require('@google/genai');
const PromptBuilder = require('./PromptBuilder');
const JSONValidator = require('./JSONValidator');
const AILogger = require('./AILogger');

/**
 * Gemini Provider implementation of the AI service interface.
 */
class GeminiProvider {
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
  async generateResume(resumeDoc, userId) {
    const startTime = Date.now();
    const resumeId = resumeDoc._id.toString();

    // Development/Test mock fallback
    if (!this.apiKey || this.apiKey === 'mock_gemini_key_for_now') {
      const mockResult = {
        summary: `Mock AI improved summary for ${resumeDoc.personalInfo?.fullName || 'User'}.`,
        experience: resumeDoc.experience?.map(exp => `Mock AI optimized bullet: ${exp.role} at ${exp.company}. ${exp.description || ''}`) || [],
        projects: resumeDoc.projects?.map(proj => `Mock AI optimized bullet: ${proj.title}. ${proj.description || ''}`) || [],
        metadata: {
          provider: "gemini",
          generatedAt: new Date().toISOString(),
          version: "1.0"
        }
      };

      const duration = Date.now() - startTime;
      AILogger.log({
        resumeId,
        userId,
        provider: 'gemini (mock)',
        generationTime: duration,
        success: true
      });

      return mockResult;
    }

    const prompt = PromptBuilder.build(resumeDoc);
    let attempts = 0;
    const maxAttempts = 2; // 1 initial call + 1 retry

    while (attempts < maxAttempts) {
      attempts++;
      try {
        const response = await this.ai.models.generateContent({
          model: 'gemini-1.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json'
          }
        });

        const textResponse = typeof response.text === 'function' ? response.text() : response.text;
        const validatedJson = JSONValidator.parseAndValidate(textResponse);

        const duration = Date.now() - startTime;
        AILogger.log({
          resumeId,
          userId,
          provider: 'gemini',
          generationTime: duration,
          success: true
        });

        return validatedJson;
      } catch (error) {
        console.warn(`[GeminiProvider] Attempt ${attempts} failed: ${error.message}`);

        if (attempts >= maxAttempts) {
          const duration = Date.now() - startTime;
          AILogger.log({
            resumeId,
            userId,
            provider: 'gemini',
            generationTime: duration,
            success: false,
            errorMessage: error.message
          });
          // Rethrow the error to be captured in AIService / controller
          throw error;
        }
      }
    }
  }
}

module.exports = GeminiProvider;
