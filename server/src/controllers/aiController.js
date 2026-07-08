const AIService = require('../services/ai/AIService');
const aiService = new AIService();

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

module.exports = {
  generateAIResume
};
