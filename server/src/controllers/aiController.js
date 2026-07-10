const AIService = require('../services/ai/AIService');
const ResumeAnalysisService = require('../services/ai/analysis/ResumeAnalysisService');
const ATSAnalysisService = require('../services/ai/analysis/ATSAnalysisService');

const aiService = new AIService();
const resumeAnalysisService = new ResumeAnalysisService();
const atsAnalysisService = new ATSAnalysisService();

/**
 * Controller handling AI Resume Generation requests.
 */
const generateAIResume = async (req, res, next) => {
  const { resumeId } = req.body;

  try {
    // Invoke AIService with the extracted data and authenticated user
    const result = await aiService.generateResume(resumeId, req.user._id);

    return res.status(200).json({
      success: true,
      message: 'Resume generated successfully',
      data: result
    });
  } catch (error) {
    // If the service threw a structured error, set the status code on response
    if (error.statusCode) {
      res.status(error.statusCode);
    }
    next(error);
  }
};

/**
 * Controller handling AI Resume Analysis requests.
 */
const analyzeAIResume = async (req, res, next) => {
  const { resumeId } = req.body;

  try {
    // Invoke ResumeAnalysisService with the authenticated user
    const result = await resumeAnalysisService.analyzeResume(resumeId, req.user._id);

    return res.status(200).json({
      success: true,
      message: 'Resume analyzed successfully',
      data: result
    });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode);
    }
    next(error);
  }
};

/**
 * Controller handling ATS Resume Analysis & Comparison requests.
 */
const atsAnalyzeResume = async (req, res, next) => {
  const { resumeId, jobDescription } = req.body;

  try {
    const result = await atsAnalysisService.analyzeATS(resumeId, jobDescription, req.user._id);

    return res.status(200).json({
      success: true,
      message: result.status === 'success' ? 'ATS Scan completed successfully' : 'Validation failed',
      data: result
    });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode);
    }
    next(error);
  }
};

module.exports = {
  generateAIResume,
  analyzeAIResume,
  atsAnalyzeResume
};
