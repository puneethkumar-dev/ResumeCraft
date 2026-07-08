/**
 * Centralized AI engine logger.
 * Logs generation details without exposing sensitive info (e.g. API keys).
 */
class AILogger {
  /**
   * Log AI generation attempt and outcome.
   * @param {object} params
   * @param {string} params.resumeId - The ID of the resume.
   * @param {string} params.userId - The ID of the user.
   * @param {string} params.provider - The AI provider name (e.g. 'gemini').
   * @param {number} params.generationTime - Time taken in ms.
   * @param {boolean} params.success - Whether generation succeeded.
   * @param {string} [params.errorMessage] - The error message if failed.
   */
  static log({ resumeId, userId, provider, generationTime, success, errorMessage }) {
    const timestamp = new Date().toISOString();
    const status = success ? 'SUCCESS' : 'FAILURE';
    const logMessage = `[AI ENGINE] [${timestamp}] Status: ${status} | ResumeID: ${resumeId} | UserID: ${userId} | Provider: ${provider} | Duration: ${generationTime}ms${errorMessage ? ` | Error: ${errorMessage}` : ''}`;
    
    // In production, you might write this to a log file or external logging service.
    // For local backend development, standard console logging is used.
    console.log(logMessage);
  }
}

module.exports = AILogger;
