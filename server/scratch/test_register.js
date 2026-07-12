const url = 'https://resumecraft-api-986122207784.asia-south1.run.app/api/auth/register';

const run = async () => {
  try {
    const payload = {
      name: 'Prod Test User',
      email: `prodtest_${Date.now()}@test.com`,
      password: 'Password123!'
    };
    
    console.log('Sending payload:', payload);
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    console.log('Status:', res.status);
    const json = await res.json();
    console.log('Response JSON:', JSON.stringify(json, null, 2));
  } catch (err) {
    console.error('Error occurred:', err);
  }
};

run();
