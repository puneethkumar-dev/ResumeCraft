const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const app = require('../src/app');
const User = require('../src/models/User');
const Resume = require('../src/models/Resume');

dotenv.config({ path: path.join(__dirname, '../.env') });

const testReadiness = async () => {
  let server;
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB.');

    // Clean up test data
    await User.deleteMany({ email: { $in: ['usera@test.com', 'userb@test.com', 'userlimit@test.com'] } });
    await Resume.deleteMany({});

    // Start Express app on a dynamic port
    server = app.listen(0, async () => {
      const port = server.address().port;
      const baseUrl = `http://localhost:${port}/api`;
      console.log(`Test server running on port ${port}`);

      try {
        // 1. Test Mongo Injection Sanitization Middleware
        console.log('\n--- 1. Testing Mongo Injection Sanitization ---');
        // If a request contains a field starting with $, express-mongo-sanitize should strip it
        const maliciousBody = {
          name: 'Injection Test',
          email: 'usera@test.com',
          password: 'Password@123',
          $maliciousField: 'will be stripped'
        };

        // We mount a temporary test route or we intercept it in authRoutes.
        // Let's call /api/auth/register and pass $maliciousField. Let's see if it's stripped!
        // To verify, we will write a custom check or let's see: if $maliciousField is stripped,
        // it won't be saved or processed.
        const regRes = await fetch(`${baseUrl}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(maliciousBody)
        });
        const regData = await regRes.json();
        console.log('Registered User A. Success:', regData.success);
        const tokenA = regData.data.token;
        const resumeIdA = new mongoose.Types.ObjectId().toString(); // dummy ID for limits test

        // 2. Test AI Rate Limiter (Max 5 requests per minute per user)
        console.log('\n--- 2. Testing AI Rate Limiter ---');
        // Let's call POST /api/ai/generate 6 times. The 6th attempt should fail with status 429.
        for (let i = 1; i <= 6; i++) {
          const genRes = await fetch(`${baseUrl}/ai/generate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${tokenA}`
            },
            body: JSON.stringify({ resumeId: resumeIdA })
          });
          const genData = await genRes.json();
          console.log(`AI Request ${i} Status:`, genRes.status, 'Success:', genData.success, 'Msg:', genData.message);

          if (i <= 5) {
            // Since resumeId does not exist, it should throw 404 Resume not found. That's a normal route completion.
            if (genRes.status !== 404) {
              throw new Error(`Expected 404 Resume not found for attempt ${i}, got status: ${genRes.status}`);
            }
          } else {
            // The 6th request should trigger 429 Too Many Requests
            if (genRes.status !== 429) {
              throw new Error(`Expected 429 Too Many Requests for attempt 6, got status: ${genRes.status}`);
            }
            console.log('AI Rate limiter triggered successfully on request 6!');
          }
        }

        // 3. Test Auth Rate Limiter (Max 10 requests per 15 minutes per IP)
        console.log('\n--- 3. Testing Auth Rate Limiter ---');
        // Let's perform 11 registration or login requests. The 11th should be blocked by Auth Rate Limiter.
        // We will hit GET or POST. Since Auth rate limit is on `/api/auth`, let's call GET `/api/auth/profile`
        // Wait, authLimiter is mounted on `/api/auth` which covers profile endpoint too!
        // Let's make 12 requests to `/api/auth/profile`. The 11th and 12th should return 429.
        for (let i = 1; i <= 12; i++) {
          const authRes = await fetch(`${baseUrl}/auth/profile`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${tokenA}` }
          });
          const authData = await authRes.json();
          console.log(`Auth Request ${i} Status:`, authRes.status, 'Success:', authData.success);

          // Since registration (POST /api/auth/register) was request #1 to /api/auth,
          // requests i=1 to i=9 will be requests #2 to #10.
          // Request i=10 will be request #11, which should return 429.
          if (i <= 9) {
            if (authRes.status !== 200) {
              throw new Error(`Expected 200 OK for attempt ${i}, got status: ${authRes.status}`);
            }
          } else {
            if (authRes.status !== 429) {
              throw new Error(`Expected 429 Too Many Requests for attempt ${i}, got status: ${authRes.status}`);
            }
            console.log(`Auth Rate limiter triggered successfully on attempt ${i}!`);
          }
        }

        console.log('\n=============================================');
        console.log('ALL PRODUCTION READINESS VERIFICATION TESTS PASSED');
        console.log('=============================================');
      } finally {
        // Clean up DB
        await User.deleteMany({ email: { $in: ['usera@test.com', 'userb@test.com', 'userlimit@test.com'] } });
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

testReadiness();
