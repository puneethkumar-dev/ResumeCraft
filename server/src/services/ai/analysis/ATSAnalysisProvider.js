const { GoogleGenAI } = require('@google/genai');

/**
 * Gemini Provider implementation of the ATS Analysis service.
 */
class ATSAnalysisProvider {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    if (this.apiKey && this.apiKey !== 'mock_gemini_key_for_now') {
      this.ai = new GoogleGenAI({ apiKey: this.apiKey });
    } else {
      // Fallback in case of missing key - however we are instructed not to use static mock data in production,
      // so if the key is missing, we will throw an error to fail gracefully instead of returning fake success.
      this.ai = null;
    }
  }

  /**
   * Compares the resume and job description using Gemini.
   * @param {object} resume - The Mongoose resume document.
   * @param {string} jobDescription - The job description text.
   * @returns {Promise<object>} The parsed ATS report.
   */
  async analyzeATS(resume, jobDescription) {
    if (!this.ai) {
      throw new Error('Gemini API key is not configured or is invalid. Real ATS analysis cannot proceed.');
    }

    // Serialize resume content for the prompt
    const resumeDetails = {
      title: resume.title,
      targetRole: resume.targetRole,
      summary: resume.summary,
      skills: resume.skills?.map(s => `${s.category}: ${s.items?.join(', ')}`).join('\n') || '',
      experience: resume.experience?.map(e => `${e.role} at ${e.company} (${e.startDate} - ${e.endDate}): ${e.description}`).join('\n') || '',
      projects: resume.projects?.map(p => `${p.title} (${p.technologies?.join(', ')}): ${p.description}`).join('\n') || '',
      education: resume.education?.map(edu => `${edu.degree} in ${edu.fieldOfStudy} at ${edu.institution} (${edu.startDate} - ${edu.endDate})`).join('\n') || '',
      certifications: resume.certifications?.map(c => `${c.title} from ${c.issuer}`).join('\n') || ''
    };

    const prompt = `You are a Principal AI Engineer and Applicant Tracking System (ATS) Expert.
Perform a complete, objective, and realistic analysis comparing the candidate's Resume against the Job Description.

Do NOT fabricate keywords or match indicators. Assess alignment strictly.

=== JOB DESCRIPTION ===
${jobDescription}

=== CANDIDATE RESUME ===
- Target Role: ${resumeDetails.targetRole}
- Professional Summary: ${resumeDetails.summary}
- Skills:\n${resumeDetails.skills}
- Experience:\n${resumeDetails.experience}
- Projects:\n${resumeDetails.projects}
- Education:\n${resumeDetails.education}
- Certifications:\n${resumeDetails.certifications}

=== REQUIRED TASKS ===
1. Verify if the job description is valid. If it is nonsense (e.g. "abcd", "hello world", or a repetitive loop), set "status" to "invalid_job_description" and provide a helpful rejection message in "message".
2. Extract all key skills, technologies, certifications, qualifications, and responsibilities mentioned in the Job Description.
3. Extract matching counterparts from the Resume.
4. Compute a dynamic, realistic compatibility score (0-100) based on:
   - Keyword Match (weight: 25%)
   - Skill Match (weight: 20%)
   - Experience Match (alignment of job titles and responsibilities) (weight: 20%)
   - Education & Certification Match (weight: 15%)
   - Resume Completeness (presence of summary, projects, details) (weight: 10%)
   - ATS Formatting (structure alignment) (weight: 10%)
   Never return a flat or default score. The score must reflect actual keyword overlap and semantic alignment.
5. Identify matched keywords and missing keywords (exact names, case-insensitive).
6. Identify matched skills and missing skills.
7. Generate actionable recommendations (detailed improvements, e.g. "Add specific achievements about containerization").
8. Generate 4-6 specific Health Diagnostics items (each must be prefixed with "✓" for pass/satisfactory alignment, and "✗" for fail/missing items, such as "✓ Strong action verbs in project details", "✗ Missing cloud architecture technologies", "✗ No internship experience listed"). Do NOT use static or generic messages. Make them reflect the actual comparative audit.

Return the response in a single, strictly valid JSON format matching this schema:
{
  "status": "success" | "invalid_job_description",
  "message": "Rejection message if status is invalid_job_description, otherwise empty",
  "overallScore": number, // 0 to 100
  "matchedKeywords": ["keyword1", "keyword2", ...],
  "missingKeywords": ["keyword1", "keyword2", ...],
  "matchedSkills": ["skill1", "skill2", ...],
  "missingSkills": ["skill1", "skill2", ...],
  "recommendations": ["rec1", "rec2", ...],
  "diagnostics": ["✓ diagnostic1", "✗ diagnostic2", ...]
}`;

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const textResponse = typeof response.text === 'function' ? response.text() : response.text;
    
    // Parse response
    let cleanText = textResponse.trim();
    if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```(json)?\s*/i, '');
      cleanText = cleanText.replace(/\s*```$/, '');
      cleanText = cleanText.trim();
    }

    const report = JSON.parse(cleanText);
    return report;
  }
}

module.exports = ATSAnalysisProvider;
