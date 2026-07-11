const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  institution: {
    type: String,
    trim: true
  },
  degree: {
    type: String,
    trim: true
  },
  fieldOfStudy: {
    type: String,
    trim: true
  },
  startDate: {
    type: String,
    trim: true
  },
  endDate: {
    type: String,
    trim: true
  },
  cgpa: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  }
});

const experienceSchema = new mongoose.Schema({
  company: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  startDate: {
    type: String,
    trim: true
  },
  endDate: {
    type: String,
    trim: true
  },
  currentlyWorking: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    trim: true
  }
});

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true
  },
  technologies: {
    type: [String],
    default: []
  },
  github: {
    type: String,
    trim: true
  },
  liveDemo: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  }
});

const skillSchema = new mongoose.Schema({
  category: {
    type: String,
    trim: true
  },
  items: {
    type: [String],
    default: []
  }
});

const certificationSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true
  },
  issuer: {
    type: String,
    trim: true
  },
  issueDate: {
    type: String,
    trim: true
  },
  expiryDate: {
    type: String,
    trim: true
  },
  credentialId: {
    type: String,
    trim: true
  },
  credentialUrl: {
    type: String,
    trim: true
  }
});

const achievementSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  date: {
    type: String,
    trim: true
  }
});

const languageSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  proficiency: { type: String, trim: true }
});

const volunteerSchema = new mongoose.Schema({
  organization: { type: String, trim: true },
  role: { type: String, trim: true },
  startDate: { type: String, trim: true },
  endDate: { type: String, trim: true },
  description: { type: String, trim: true }
});

const publicationSchema = new mongoose.Schema({
  title: { type: String, trim: true },
  publisher: { type: String, trim: true },
  date: { type: String, trim: true },
  link: { type: String, trim: true },
  description: { type: String, trim: true }
});

const generatedContentSchema = new mongoose.Schema({
  summary: {
    type: String,
    default: ''
  },
  experience: {
    type: [mongoose.Schema.Types.Mixed],
    default: []
  },
  projects: {
    type: [mongoose.Schema.Types.Mixed],
    default: []
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, { _id: false });

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true
    },
    title: {
      type: String,
      trim: true,
      default: 'Untitled Resume'
    },
    targetRole: {
      type: String,
      trim: true,
      default: ''
    },
    template: {
      type: String,
      trim: true,
      default: 'Modern Minimalist'
    },
    personalInfo: {
      fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true
      },
      email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true
      },
      phone: {
        type: String,
        trim: true
      },
      location: {
        type: String,
        trim: true
      },
      linkedin: {
        type: String,
        trim: true
      },
      github: {
        type: String,
        trim: true
      },
      portfolio: {
        type: String,
        trim: true
      }
    },
    summary: {
      type: String,
      trim: true
    },
    education: {
      type: [educationSchema],
      default: []
    },
    experience: {
      type: [experienceSchema],
      default: []
    },
    projects: {
      type: [projectSchema],
      default: []
    },
    skills: {
      type: [skillSchema],
      default: []
    },
    certifications: {
      type: [certificationSchema],
      default: []
    },
    achievements: {
      type: [achievementSchema],
      default: []
    },
    languages: {
      type: [languageSchema],
      default: []
    },
    interests: {
      type: [String],
      default: []
    },
    volunteerExperience: {
      type: [volunteerSchema],
      default: []
    },
    publications: {
      type: [publicationSchema],
      default: []
    },
    generatedContent: {
      type: generatedContentSchema,
      default: () => ({})
    },
    atsScore: {
      type: Number,
      default: 0
    },
    analysis: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Resume', resumeSchema);
