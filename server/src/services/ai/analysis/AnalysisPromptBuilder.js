/**
 * Helper to construct the system prompts and instruction inputs for the AI Analysis.
 */
class AnalysisPromptBuilder {
  /**
   * Constructs the prompt payload with system role, strict rules, input data, and expected output format.
   * @param {object} resumeData - The Mongoose resume document.
   * @returns {string} The prompt text.
   */
  static build(resumeData) {
    const systemRole = `You are a Principal Technical Recruiter and Senior ATS Resume Auditor. Your task is to perform a detailed evaluation of the candidate's resume and return structured constructive criticism.`;

    const rules = [
      "Analyze only the provided resume information.",
      "Do not invent candidate experiences, projects, or achievements.",
      "overallScore should reflect general resume quality (0-100 scale).",
      "atsScore should evaluate keyword compliance, layout structures readability (0-100 scale).",
      "grammarScore should evaluate sentence composition and writing polish (0-100 scale).",
      "readabilityScore should assess visual layout clarity and section length (0-100 scale).",
      "List 2-4 key structural strengths.",
      "List 2-4 key structural weaknesses.",
      "List 3-5 clear actionable suggestions to improve the resume.",
      "Identify 3-6 missing skills (technologies, tools, methodologies) that are standard for the targetRole but are missing from the candidate's skills or experience lists.",
      "Return ONLY valid JSON matching the expected structure. No explanations, no markdown wrap."
    ];

    const inputPayload = {
      personalInfo: resumeData.personalInfo || {},
      targetRole: resumeData.targetRole || '',
      summary: resumeData.summary || '',
      education: resumeData.education || [],
      experience: resumeData.experience || [],
      projects: resumeData.projects || [],
      skills: resumeData.skills || [],
      certifications: resumeData.certifications || [],
      achievements: resumeData.achievements || []
    };

    const expectedFormat = {
      overallScore: 78,
      atsScore: 72,
      grammarScore: 85,
      readabilityScore: 80,
      strengths: [
        "First positive feedback item about formatting or accomplishments."
      ],
      weaknesses: [
        "First area of criticism regarding details, formatting, or metrics."
      ],
      suggestions: [
        "First specific actionable instruction on what needs to be changed."
      ],
      missingSkills: [
        "TypeScript",
        "Docker"
      ]
    };

    return `
${systemRole}

STRICT RULES:
${rules.map((r, i) => `${i + 1}. ${r}`).join('\n')}

INPUT RESUME DATA:
${JSON.stringify(inputPayload, null, 2)}

EXPECTED OUTPUT FORMAT (Return ONLY a JSON object matching this structure. No markdown formatting, no code block backticks):
${JSON.stringify(expectedFormat, null, 2)}
`;
  }
}

module.exports = AnalysisPromptBuilder;
