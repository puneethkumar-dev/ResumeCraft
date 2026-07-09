const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const app = require('../src/app');
const User = require('../src/models/User');
const Resume = require('../src/models/Resume');

dotenv.config({ path: path.join(__dirname, '../.env') });

const testResumeAPI = async () => {
  let server;
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB.');

    // Clear test data to ensure clean state
    await User.deleteMany({ email: { $in: ['usera@test.com', 'userb@test.com'] } });
    await Resume.deleteMany({}); // Warning: deletes all resumes. This is fine for sandbox development.

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

        // 3. Test Create Resume for User A (Missing fullName)
        const createFailName = await fetch(`${baseUrl}/resumes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenA}`
          },
          body: JSON.stringify({
            personalInfo: {
              email: 'usera@test.com'
            },
            education: [{ institution: 'Uni A', degree: 'BSc' }]
          })
        });
        const failNameData = await createFailName.json();
        console.log('Create missing name response status:', createFailName.status, failNameData);
        if (createFailName.status !== 400 || failNameData.success !== false) {
          throw new Error('Expected 400 Bad Request for missing fullName');
        }

        // 4. Test Create Resume for User A (Missing email)
        const createFailEmail = await fetch(`${baseUrl}/resumes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenA}`
          },
          body: JSON.stringify({
            personalInfo: {
              fullName: 'User A'
            },
            education: [{ institution: 'Uni A', degree: 'BSc' }]
          })
        });
        const failEmailData = await createFailEmail.json();
        console.log('Create missing email response status:', createFailEmail.status, failEmailData);
        if (createFailEmail.status !== 400 || failEmailData.success !== false) {
          throw new Error('Expected 400 Bad Request for missing email');
        }

        // 5. Test Create Resume for User A (Empty/missing education array)
        const createFailEdu = await fetch(`${baseUrl}/resumes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenA}`
          },
          body: JSON.stringify({
            personalInfo: {
              fullName: 'User A',
              email: 'usera@test.com'
            },
            education: []
          })
        });
        const failEduData = await createFailEdu.json();
        console.log('Create empty education response status:', createFailEdu.status, failEduData);
        if (createFailEdu.status !== 400 || failEduData.success !== false) {
          throw new Error('Expected 400 Bad Request for empty/missing education');
        }

        // 6. Test Create Valid Resume for User A
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
        console.log('Create valid resume response status:', createSuccess.status, successData);
        if (createSuccess.status !== 201 || successData.success !== true || !successData.data._id) {
          throw new Error('Expected 201 Created and resume ID returned');
        }
        const resumeId = successData.data._id;
        console.log('Created resume successfully. ID:', resumeId);

        // 7. Get All Resumes for User A
        const getAllARes = await fetch(`${baseUrl}/resumes`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${tokenA}`
          }
        });
        const getAllAData = await getAllARes.json();
        console.log('Get all resumes A status:', getAllARes.status, 'Count:', getAllAData.data.length);
        if (getAllARes.status !== 200 || getAllAData.data.length !== 1) {
          throw new Error('Expected User A to have exactly 1 resume');
        }

        // 8. Get All Resumes for User B (should be empty list, not User A's resume)
        const getAllBRes = await fetch(`${baseUrl}/resumes`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${tokenB}`
          }
        });
        const getAllBData = await getAllBRes.json();
        console.log('Get all resumes B status:', getAllBRes.status, 'Count:', getAllBData.data.length);
        if (getAllBRes.status !== 200 || getAllBData.data.length !== 0) {
          throw new Error('Expected User B to have 0 resumes');
        }

        // 9. Get Single Resume by ID for User A (Owner)
        const getSingleARes = await fetch(`${baseUrl}/resumes/${resumeId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${tokenA}`
          }
        });
        const getSingleAData = await getSingleARes.json();
        console.log('Get single resume A status:', getSingleARes.status, 'Success:', getSingleAData.success);
        if (getSingleARes.status !== 200 || getSingleAData.data._id !== resumeId) {
          throw new Error('Expected to successfully retrieve the resume');
        }

        // Verify updated schema defaults
        if (getSingleAData.data.atsScore !== 0) {
          throw new Error(`Expected atsScore to default to 0, got ${getSingleAData.data.atsScore}`);
        }
        if (!getSingleAData.data.generatedContent || typeof getSingleAData.data.generatedContent !== 'object') {
          throw new Error('Expected generatedContent to be an object');
        }
        if (getSingleAData.data.generatedContent.summary !== '') {
          throw new Error(`Expected generatedContent.summary to be empty string, got: ${getSingleAData.data.generatedContent.summary}`);
        }

        // 10. Get Single Resume by ID for User B (Not Owner) -> Expect 403 Forbidden
        const getSingleBRes = await fetch(`${baseUrl}/resumes/${resumeId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${tokenB}`
          }
        });
        const getSingleBData = await getSingleBRes.json();
        console.log('Get single resume B status:', getSingleBRes.status, 'Response:', getSingleBData);
        if (getSingleBRes.status !== 403 || getSingleBData.success !== false) {
          throw new Error('Expected 403 Forbidden when accessing another user\'s resume');
        }

        // 11. Update Resume (PUT) for User B (Not Owner) -> Expect 403 Forbidden
        const updateBRes = await fetch(`${baseUrl}/resumes/${resumeId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenB}`
          },
          body: JSON.stringify({
            ...validResumeBody,
            personalInfo: {
              ...validResumeBody.personalInfo,
              fullName: 'User B Hacked Name'
            }
          })
        });
        const updateBData = await updateBRes.json();
        console.log('Update resume B status:', updateBRes.status, 'Response:', updateBData);
        if (updateBRes.status !== 403 || updateBData.success !== false) {
          throw new Error('Expected 403 Forbidden when updating another user\'s resume');
        }

        // 12. Update Resume (PUT) with invalid ID format -> Expect 400 Bad Request (from ID validator)
        const updateInvalidIdRes = await fetch(`${baseUrl}/resumes/invalid_mongo_id`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenA}`
          },
          body: JSON.stringify(validResumeBody)
        });
        const updateInvalidIdData = await updateInvalidIdRes.json();
        console.log('Update invalid ID status:', updateInvalidIdRes.status, 'Response:', updateInvalidIdData);
        if (updateInvalidIdRes.status !== 400 || updateInvalidIdData.success !== false) {
          throw new Error('Expected 400 Bad Request for invalid MongoDB ObjectId format');
        }

        // 13. Update Resume (PUT) with valid ID but does not exist -> Expect 404 Not Found
        const fakeId = new mongoose.Types.ObjectId().toString();
        const updateFakeIdRes = await fetch(`${baseUrl}/resumes/${fakeId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenA}`
          },
          body: JSON.stringify(validResumeBody)
        });
        const updateFakeIdData = await updateFakeIdRes.json();
        console.log('Update fake ID status:', updateFakeIdRes.status, 'Response:', updateFakeIdData);
        if (updateFakeIdRes.status !== 404 || updateFakeIdData.success !== false) {
          throw new Error('Expected 404 Not Found for non-existent resume ID');
        }

        // 14. Update Resume (PUT) for User A (Owner) -> Expect 200 OK
        const updatedBody = {
          ...validResumeBody,
          personalInfo: {
            ...validResumeBody.personalInfo,
            fullName: 'User A Updated Name'
          },
          generatedContent: {
            summary: 'Experienced Backend Developer',
            experience: ['MOCKED EXP'],
            projects: ['MOCKED PROJ']
          },
          atsScore: 90
        };
        const updateARes = await fetch(`${baseUrl}/resumes/${resumeId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenA}`
          },
          body: JSON.stringify(updatedBody)
        });
        const updateAData = await updateARes.json();
        console.log('Update resume A status:', updateARes.status, 'Updated Name:', updateAData.data.personalInfo.fullName);
        if (updateARes.status !== 200 || updateAData.data.personalInfo.fullName !== 'User A Updated Name') {
          throw new Error('Expected 200 OK and updated resume returned');
        }
        if (updateAData.data.atsScore !== 90) {
          throw new Error(`Expected updated atsScore to be 90, got: ${updateAData.data.atsScore}`);
        }
        if (updateAData.data.generatedContent.summary !== 'Experienced Backend Developer') {
          throw new Error(`Expected updated generatedContent.summary, got: ${updateAData.data.generatedContent.summary}`);
        }

        // 15. Delete Resume (DELETE) for User B (Not Owner) -> Expect 403 Forbidden
        const deleteBRes = await fetch(`${baseUrl}/resumes/${resumeId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${tokenB}`
          }
        });
        const deleteBData = await deleteBRes.json();
        console.log('Delete resume B status:', deleteBRes.status, 'Response:', deleteBData);
        if (deleteBRes.status !== 403 || deleteBData.success !== false) {
          throw new Error('Expected 403 Forbidden when deleting another user\'s resume');
        }

        // 16. Delete Resume (DELETE) for User A (Owner) -> Expect 200 OK
        const deleteARes = await fetch(`${baseUrl}/resumes/${resumeId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${tokenA}`
          }
        });
        const deleteAData = await deleteARes.json();
        console.log('Delete resume A status:', deleteARes.status, 'Response:', deleteAData);
        if (deleteARes.status !== 200 || deleteAData.success !== true) {
          throw new Error('Expected 200 OK when deleting own resume');
        }

        // 17. Verify Delete actually removed it
        const verifyDeletedRes = await fetch(`${baseUrl}/resumes/${resumeId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${tokenA}`
          }
        });
        console.log('Verify deleted status:', verifyDeletedRes.status);
        if (verifyDeletedRes.status !== 404) {
          throw new Error('Expected 404 Not Found for deleted resume');
        }

        console.log('=============================================');
        console.log('ALL API INTEGRATION TESTS PASSED SUCCESSFULLY');
        console.log('=============================================');
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

testResumeAPI();
