const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const Resume = require('../src/models/Resume');

const testAIAPI = async () => {
  let server;
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB.');

    // Clear test data to ensure clean state
    await User.deleteMany({ email: { $in: ['usera@test.com', 'userb@test.com'] } });
    await Resume.deleteMany({});

    // Start Express app on a dynamic port
    server = app.listen(0, async () => {
      const port = server.address().port;
      const baseUrl = `http://localhost:${port}/api`;
      console.log(`Test server running on port ${port}`);

      try {
        // 1. Register User A
        const regARes = await fetch(`${baseUrl}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'User A',
            email: 'usera@test.com',
            password: 'Password@123'
          })
        });
        const regAData = await regARes.json();
        if (!regAData.success) throw new Error(`User A registration failed: ${regAData.message}`);
        const tokenA = regAData.data.token;
        const userIdA = regAData.data.user._id;
        console.log('User A registered. ID:', userIdA);

        // 2. Register User B
        const regBRes = await fetch(`${baseUrl}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'User B',
            email: 'userb@test.com',
            password: 'Password@123'
          })
        });
        const regBData = await regBRes.json();
        if (!regBData.success) throw new Error(`User B registration failed: ${regBData.message}`);
        const tokenB = regBData.data.token;
        const userIdB = regBData.data.user._id;
        console.log('User B registered. ID:', userIdB);

        // 3. Create Valid Resume for User A
        const validResumeBody = {
          personalInfo: {
            fullName: 'User A',
            email: 'usera@test.com',
            phone: '1234567890',
            location: 'New York, USA',
            linkedin: 'https://linkedin.com/in/usera',
            github: 'https://github.com/usera',
            portfolio: 'https://usera.me'
          },
          summary: 'Experienced Node.js developer',
          education: [{
            institution: 'Uni A',
            degree: 'BSc',
            fieldOfStudy: 'Computer Science',
            startDate: '2020-09',
            endDate: '2024-05',
            cgpa: '3.8/4.0',
            description: 'Focused on algorithms'
          }],
          experience: [{
            company: 'Tech Corp',
            role: 'Software Engineer Intern',
            location: 'Remote',
            startDate: '2023-06',
            endDate: '2023-08',
            currentlyWorking: false,
            description: 'Developed microservices'
          }],
          projects: [{
            title: 'ResumeCraft',
            technologies: ['Node.js', 'Express', 'MongoDB'],
            github: 'https://github.com/usera/resumecraft',
            liveDemo: 'https://resumecraft.com',
            description: 'A resume builder app'
          }],
          skills: [{
            category: 'Backend',
            items: ['Node.js', 'Express', 'Mongoose']
          }],
          certifications: [{
            title: 'AWS Developer',
            issuer: 'Amazon',
            issueDate: '2025-01',
            credentialId: 'AWS-12345'
          }],
          achievements: [{
            title: 'Hackathon Winner',
            description: 'Won 1st place out of 50 teams'
          }]
        };

        const createSuccess = await fetch(`${baseUrl}/resumes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenA}`
          },
          body: JSON.stringify(validResumeBody)
        });
        const successData = await createSuccess.json();
        if (createSuccess.status !== 201 || !successData.data._id) {
          throw new Error('Expected 201 Created and resume ID returned');
        }
        const resumeId = successData.data._id;
        console.log('Created resume successfully. ID:', resumeId);

        // 4. Test AI generation with invalid ID format -> Expect 400 Bad Request
        const genFailIdFormat = await fetch(`${baseUrl}/ai/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenA}`
          },
          body: JSON.stringify({ resumeId: 'invalid_id_format' })
        });
        const genFailIdFormatData = await genFailIdFormat.json();
        console.log('Gen invalid ID format status:', genFailIdFormat.status, genFailIdFormatData);
        if (genFailIdFormat.status !== 400 || genFailIdFormatData.success !== false) {
          throw new Error('Expected 400 Bad Request for invalid MongoDB ObjectId format');
        }

        // 5. Test AI generation with non-existent ID -> Expect 404 Not Found
        const fakeId = new mongoose.Types.ObjectId().toString();
        const genFailFakeId = await fetch(`${baseUrl}/ai/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenA}`
          },
          body: JSON.stringify({ resumeId: fakeId })
        });
        const genFailFakeIdData = await genFailFakeId.json();
        console.log('Gen fake ID status:', genFailFakeId.status, genFailFakeIdData);
        if (genFailFakeId.status !== 404 || genFailFakeIdData.success !== false) {
          throw new Error('Expected 404 Not Found for non-existent resume ID');
        }

        // 6. Test AI generation by unauthorized user (User B trying to access User A's resume) -> Expect 403 Forbidden
        const genFailUnauth = await fetch(`${baseUrl}/ai/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenB}`
          },
          body: JSON.stringify({ resumeId })
        });
        const genFailUnauthData = await genFailUnauth.json();
        console.log('Gen unauth status:', genFailUnauth.status, genFailUnauthData);
        if (genFailUnauth.status !== 403 || genFailUnauthData.success !== false) {
          throw new Error('Expected 403 Forbidden for unauthorized access to other user\'s resume');
        }

        // 7. Test AI generation by Owner (User A) -> Expect 200 OK
        const genSuccess = await fetch(`${baseUrl}/ai/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenA}`
          },
          body: JSON.stringify({ resumeId })
        });
        const genSuccessData = await genSuccess.json();
        console.log('Gen success status:', genSuccess.status, genSuccessData);
        if (genSuccess.status !== 200 || genSuccessData.success !== true) {
          throw new Error('Expected 200 OK for successful resume generation');
        }

        // Verify structure of the returned generatedContent
        const content = genSuccessData.data.generatedContent;
        if (!content || typeof content.summary !== 'string' || !Array.isArray(content.experience) || !Array.isArray(content.projects) || !content.metadata) {
          throw new Error('Invalid generatedContent structure in response');
        }
        if (content.metadata.provider !== 'gemini' && content.metadata.provider !== 'gemini (mock)') {
          throw new Error('Invalid provider metadata in response');
        }
        console.log('AI generation returned valid output format.');

        // 8. Fetch Resume using GET /api/resumes/:id and verify generatedContent is stored in DB
        const getResume = await fetch(`${baseUrl}/resumes/${resumeId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${tokenA}`
          }
        });
        const getResumeData = await getResume.json();
        console.log('Get resume status:', getResume.status, 'Has generatedContent:', !!getResumeData.data.generatedContent);
        if (getResume.status !== 200 || !getResumeData.data.generatedContent || getResumeData.data.generatedContent.summary !== content.summary) {
          throw new Error('Expected saved generatedContent to match returned content');
        }

        console.log('============================================');
        console.log('ALL AI ENGINE INTEGRATION TESTS PASSED OK');
        console.log('============================================');
      } finally {
        // Clean up DB
        await User.deleteMany({ email: { $in: ['usera@test.com', 'userb@test.com'] } });
        await Resume.deleteMany({});
        server.close(async () => {
          await mongoose.disconnect();
          console.log('Test server stopped & database disconnected.');
          process.exit(0);
        });
      }
    });
  } catch (error) {
    console.error('Test script error:', error);
    if (server) server.close();
    await mongoose.disconnect();
    process.exit(1);
  }
};

testAIAPI();
