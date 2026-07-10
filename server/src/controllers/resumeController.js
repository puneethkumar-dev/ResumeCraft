const Resume = require('../models/Resume');

/**
 * @desc    Create a new resume
 * @route   POST /api/resumes
 * @access  Private
 */
const createResume = async (req, res, next) => {
  try {
    // Attach the authenticated user's ID to the resume body
    const resumeData = {
      ...req.body,
      user: req.user._id
    };

    const resume = await Resume.create(resumeData);

    return res.status(201).json({
      success: true,
      message: 'Resume created successfully',
      data: {
        _id: resume._id
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all resumes for the authenticated user
 * @route   GET /api/resumes
 * @access  Private
 */
const getAllResumes = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ user: req.user._id });

    return res.status(200).json({
      success: true,
      message: 'Resumes retrieved successfully',
      data: resumes
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single resume by ID
 * @route   GET /api/resumes/:id
 * @access  Private
 */
const getResumeById = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    // Ownership check: Return 403 Forbidden if not the owner
    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this resume'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Resume retrieved successfully',
      data: resume
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a resume by ID
 * @route   PUT /api/resumes/:id
 * @access  Private
 */
const updateResume = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    // Ownership check: Return 403 Forbidden if not the owner
    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this resume'
      });
    }

    // Prevent changing the user ownership via update body
    const updateData = { ...req.body };
    delete updateData.user;

    const updatedResume = await Resume.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: false }
    );

    return res.status(200).json({
      success: true,
      message: 'Resume updated successfully',
      data: updatedResume
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a resume by ID
 * @route   DELETE /api/resumes/:id
 * @access  Private
 */
const deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    // Ownership check: Return 403 Forbidden if not the owner
    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this resume'
      });
    }

    await resume.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Resume deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createResume,
  getAllResumes,
  getResumeById,
  updateResume,
  deleteResume
};
