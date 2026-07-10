const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../src/models/User');
const Resume = require('../src/models/Resume');
const ATSAnalysisService = require('../src/services/ai/analysis/ATSAnalysisService');

dotenv.config({ path: path.join(__dirname, '../.env') });

const testATSAnalysis = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB.');

    // 1. Create a test user
    const testUserEmail = 'ats_tester@test.com';
    await User.deleteMany({ email: testUserEmail });
    await Resume.deleteMany({ 'personalInfo.email': testUserEmail });

    const user = await User.create({
      name: 'ATS Tester',
      email: testUserEmail,
      password: 'Password@123'
    });
    console.log('Test User Created:', user._id);

    // Instantiate ATS Service
    const atsService = new ATSAnalysisService();

    // 2. Test Case 1: Incomplete Resume Validation
    const incompleteResume = await Resume.create({
      user: user._id,
      personalInfo: {
        fullName: 'ATS Tester',
        email: testUserEmail
      },
      skills: [], // No skills
      education: [],
      projects: [],
      experience: []
    });

    console.log('\n--- Test Case 1: Incomplete Resume Validation ---');
    const res1 = await atsService.analyzeATS(
      incompleteResume._id.toString(),
      'This is a valid job description with more than 100 characters. We are looking for a Senior Software Engineer with strong experience in JavaScript, Node.js, React, and databases. We require good engineering qualifications and skills.',
      user._id.toString()
    );
    console.log('Result:', res1);
    if (res1.status !== 'incomplete_resume') {
      throw new Error('Expected incomplete_resume status for empty profile lists');
    }
    console.log('✓ Incomplete Resume validation rejected correctly.');

    // 3. Test Case 2: Short Job Description Validation
    // Let's create a complete resume
    const completeResume = await Resume.create({
      user: user._id,
      personalInfo: {
        fullName: 'ATS Tester',
        email: testUserEmail,
        phone: '1234567890',
        location: 'San Francisco, CA'
      },
      summary: 'Senior Frontend Developer with 5 years of experience building modern web apps.',
      skills: [
        { category: 'Frontend', items: ['React', 'JavaScript', 'TypeScript'] },
        { category: 'Backend', items: ['Node.js', 'Express'] }
      ],
      education: [
        { institution: 'Stanford University', degree: 'BSc', fieldOfStudy: 'Computer Science', startDate: '2016', endDate: '2020' }
      ],
      projects: [
        { title: 'ResumeCraft Project', technologies: ['React', 'Node.js'], description: 'A standard resume builder application.' }
      ],
      experience: [
        { company: 'Software Corp', role: 'Software Engineer', location: 'Remote', startDate: '2020', endDate: '2025', description: 'Developed React components and REST APIs.' }
      ]
    });

    console.log('\n--- Test Case 2: Job Description Too Short ---');
    const res2 = await atsService.analyzeATS(
      completeResume._id.toString(),
      'Happy Birthday! Hello World! This is too short.',
      user._id.toString()
    );
    console.log('Result:', res2);
    if (res2.status !== 'invalid_job_description') {
      throw new Error('Expected invalid_job_description for short description text');
    }
    console.log('✓ Short Job Description rejected correctly.');

    // 4. Test Case 3: Repetitive Nonsense Job Description
    console.log('\n--- Test Case 3: Repetitive Nonsense Job Description ---');
    const res3 = await atsService.analyzeATS(
      completeResume._id.toString(),
      'abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd',
      user._id.toString()
    );
    console.log('Result:', res3);
    if (res3.status !== 'invalid_job_description') {
      throw new Error('Expected invalid_job_description for repetitive abcd sequences');
    }
    console.log('✓ Repetitive nonsense rejected correctly.');

    // 5. Test Case 4: Missing Professional Keywords
    console.log('\n--- Test Case 4: Missing Professional Keywords ---');
    const res4 = await atsService.analyzeATS(
      completeResume._id.toString(),
      'Yesterday, we went to a lovely restaurant by the beach. The food was absolutely delicious, especially the seafood platter and the dessert. We had a great time talking about travel, movies, and hobbies. It was a wonderful sunny afternoon and we walked along the shore for hours, collecting shells and looking at the sunset.',
      user._id.toString()
    );
    console.log('Result:', res4);
    if (res4.status !== 'invalid_job_description') {
      throw new Error('Expected invalid_job_description when no professional keywords exist');
    }
    console.log('✓ Non-professional text rejected correctly.');

    // 6. Test Case 5: Valid Resume & Valid Job Description (Gemini Execution)
    console.log('\n--- Test Case 5: Valid Execution (Gemini API Call) ---');
    const validJobDescription = `
      We are looking for a Senior Software Engineer to join our frontend development team.
      Requirements:
      - 3+ years of professional software engineering experience.
      - Strong proficiency in JavaScript, TypeScript, and modern frameworks, particularly React.
      - Experience building server-side applications in Node.js and Express.
      - Proven experience with database systems (SQL, PostgreSQL, MongoDB).
      - Experience with cloud service deployments (AWS, Docker, Kubernetes) is a strong plus.
      Qualifications:
      - Bachelor's degree in Computer Science, engineering, or equivalent credentials.
      Responsibilities:
      - Design, implement, and support scalable frontend web applications.
      - Write unit tests and maintain clean code standards.
    `;
    const res5 = await atsService.analyzeATS(
      completeResume._id.toString(),
      validJobDescription,
      user._id.toString()
    );
    console.log('Result:', JSON.stringify(res5, null, 2));
    
    if (res5.status !== 'success') {
      throw new Error(`Expected success from Gemini, got status: ${res5.status}`);
    }
    if (typeof res5.overallScore !== 'number' || res5.overallScore < 0 || res5.overallScore > 100) {
      throw new Error(`Expected valid overallScore, got: ${res5.overallScore}`);
    }
    if (!Array.isArray(res5.matchedKeywords) || !Array.isArray(res5.missingKeywords)) {
      throw new Error('Expected matchedKeywords and missingKeywords arrays');
    }
    if (!Array.isArray(res5.diagnostics) || res5.diagnostics.length === 0) {
      throw new Error('Expected diagnostics check array');
    }
    console.log('✓ Successful real ATS analysis executed and validated.');

    // 7. Verify score is saved in database
    const updatedResume = await Resume.findById(completeResume._id);
    console.log('\nSaved atsScore in Database:', updatedResume.atsScore);
    if (updatedResume.atsScore !== res5.overallScore) {
      throw new Error('Expected saved score to match calculated AI overallScore');
    }
    console.log('✓ Verification check database save validated.');

    // Clean up
    await User.deleteMany({ email: testUserEmail });
    await Resume.deleteMany({ 'personalInfo.email': testUserEmail });
    await mongoose.disconnect();
    console.log('\nDatabase disconnected. Test run successful!');
    process.exit(0);

  } catch (err) {
    console.error('\n❌ ATS Analysis test script failed:', err);
    await mongoose.disconnect();
    process.exit(1);
  }
};

testATSAnalysis();
