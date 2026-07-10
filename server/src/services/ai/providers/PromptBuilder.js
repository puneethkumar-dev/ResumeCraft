/**
 * Helper to construct the system prompts and instruction inputs for the AI provider.
 */
class PromptBuilder {
  /**
   * Constructs the prompt payload with system role, strict rules, input data, and expected output format.
   * @param {object} resumeData - The full resume document content.
   * @returns {string} The prompt text.
   */
  static build(resumeData) {
    const systemRole = `You are an expert ATS Resume Writer. Your responsibility is to improve wording while preserving factual accuracy.`;
    
    const rules = [
      "Use strong action verbs.",
      "Improve grammar.",
      "Improve readability.",
      "Improve ATS compatibility.",
      "Never invent information.",
      "Never fabricate experience.",
      "Never fabricate companies.",
      "Never fabricate projects.",
      "Never fabricate technologies.",
      "Never fabricate certifications.",
      "Never fabricate achievements.",
      "Never estimate percentages.",
      "Never estimate metrics.",
      "Never assume missing information.",
      "Only rewrite existing information.",
      "If information is insufficient, leave it unchanged.",
      "Return ONLY valid JSON.",
      "Do NOT return Markdown.",
      "Do NOT wrap inside code blocks.",
      "Do NOT explain anything."
    ];

    const inputPayload = {
      personalInfo: resumeData.personalInfo || {},
      summary: resumeData.summary || '',
      education: resumeData.education || [],
      experience: resumeData.experience || [],
      projects: resumeData.projects || [],
      skills: resumeData.skills || [],
      certifications: resumeData.certifications || [],
      achievements: resumeData.achievements || []
    };

    const expectedFormat = {
      summary: "Improved professional ATS summary string.",
      experience: [
        {
          id: "exp_1",
          company: "Google",
          role: "Software Engineer",
          location: "Mountain View, CA",
          startDate: "June 2022",
          endDate: "Present",
          description: "Improved ATS-optimized bullet points or text description using strong action verbs."
        }
      ],
      projects: [
        {
          id: "proj_1",
          title: "E-Commerce System",
          technologies: ["React", "Node.js"],
          liveDemo: "https://example.com",
          description: "Improved ATS-optimized description for the project entry."
        }
      ],
      metadata: {
        provider: "gemini",
        generatedAt: "ISO_DATE",
        version: "1.0"
      }
    };

    return `
${systemRole}

STRICT RULES:
${rules.map((r, i) => `${i + 1}. ${r}`).join('\n')}

INPUT RESUME DATA:
${JSON.stringify(inputPayload, null, 2)}

EXPECTED OUTPUT FORMAT (Return ONLY a JSON object matching this structure. No markdown formatting, no code block backticks, no text before or after the JSON):
${JSON.stringify(expectedFormat, null, 2)}
`;
  }
}

module.exports = PromptBuilder;
