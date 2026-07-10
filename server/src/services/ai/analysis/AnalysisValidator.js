/**
 * Validates and parses the JSON response from the AI Analysis provider.
 */
class AnalysisValidator {
  /**
   * Sanitizes, parses, and validates the required fields of the AI Analysis response.
   * @param {string} rawString - The raw string response from the AI.
   * @returns {object} The parsed and validated JSON object.
   * @throws {Error} If parsing fails or required fields are invalid/missing.
   */
  static parseAndValidate(rawString) {
    if (!rawString || typeof rawString !== 'string') {
      throw new Error('Raw AI response is empty or not a string');
    }

    const cleaned = this.cleanJsonString(rawString);
    let parsed;

    try {
      parsed = JSON.parse(cleaned);
    } catch (error) {
      throw new Error(`JSON parsing failed: ${error.message}`);
    }

    // Validate score ranges and type
    const scores = ['overallScore', 'atsScore', 'grammarScore', 'readabilityScore'];
    scores.forEach(s => {
      if (parsed[s] === undefined || typeof parsed[s] !== 'number') {
        throw new Error(`Missing or invalid score field '${s}' (must be a number)`);
      }
      if (parsed[s] < 0 || parsed[s] > 100) {
        throw new Error(`Score '${s}' must be between 0 and 100`);
      }
    });

    // Validate arrays
    const arrays = ['strengths', 'weaknesses', 'suggestions', 'missingSkills'];
    arrays.forEach(arr => {
      if (!Array.isArray(parsed[arr])) {
        throw new Error(`Missing or invalid field '${arr}' (must be an array)`);
      }
      parsed[arr].forEach(item => {
        if (typeof item !== 'string') {
          throw new Error(`Elements of array '${arr}' must be strings`);
        }
      });
    });

    return parsed;
  }

  /**
   * Cleans potential markdown blocks from the raw response string.
   * @param {string} str - The raw response string.
   * @returns {string} The cleaned string.
   */
  static cleanJsonString(str) {
    let clean = str.trim();
    // Strip markdown code block wrappers if present
    if (clean.startsWith('```')) {
      clean = clean.replace(/^```(json)?\s*/i, '');
      clean = clean.replace(/\s*```$/, '');
      clean = clean.trim();
    }
    return clean;
  }
}

module.exports = AnalysisValidator;
