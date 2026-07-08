const express = require('express');
const router = express.Router();

const {
  createResume,
  getAllResumes,
  getResumeById,
  updateResume,
  deleteResume
} = require('../controllers/resumeController');

const { protect } = require('../middleware/auth');
const {
  resumeRules,
  idParamRules,
  validate
} = require('../validators/resumeValidator');

// Create a new resume
router.post('/', protect, resumeRules, validate, createResume);

// Get all resumes of the authenticated user
router.get('/', protect, getAllResumes);

// Get a single resume by ID
router.get('/:id', protect, idParamRules, validate, getResumeById);

// Update a resume by ID
router.put('/:id', protect, idParamRules, validate, resumeRules, validate, updateResume);

// Delete a resume by ID
router.delete('/:id', protect, idParamRules, validate, deleteResume);

module.exports = router;
