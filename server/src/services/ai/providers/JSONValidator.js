/**
 * Validates and parses the JSON response from the AI provider.
 */
class JSONValidator {
  /**
   * Sanitizes, parses, and validates the required fields of the AI response.
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

    // Validation checks
    if (parsed.summary === undefined || typeof parsed.summary !== 'string') {
      throw new Error("Missing or invalid field 'summary' (must be string)");
    }
    if (!Array.isArray(parsed.experience)) {
      throw new Error("Missing or invalid field 'experience' (must be array)");
    }
    if (!Array.isArray(parsed.projects)) {
      throw new Error("Missing or invalid field 'projects' (must be array)");
    }
    if (!parsed.metadata || typeof parsed.metadata !== 'object') {
      throw new Error("Missing or invalid field 'metadata' (must be object)");
    }

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

module.exports = JSONValidator;
