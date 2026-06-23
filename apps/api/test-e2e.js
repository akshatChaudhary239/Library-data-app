const axios = require('axios');

const API_URL = 'http://localhost:4000/api/v1';

async function runTests() {
  console.log('Starting E2E Tests...');
  let token = '';
  let studentId = '';
  let seatId = '';

  try {
    // 1. Auth Signup
    console.log('Testing Signup...');
    const signupRes = await axios.post(`${API_URL}/auth/signup`, {
      name: 'Test User',
      email: `test${Date.now()}@library.com`,
      password: 'password123'
    });
    console.log('Signup Successful. Data:', JSON.stringify(signupRes.data, null, 2));

    console.log('Testing Initial Login...');
    const initLoginRes = await axios.post(`${API_URL}/auth/login`, {
      email: signupRes.data.data.user.email,
      password: 'password123'
    });
    let signupToken = initLoginRes.data.data?.accessToken || initLoginRes.data.data?.token || initLoginRes.data.token;
    axios.defaults.headers.common['Authorization'] = `Bearer ${signupToken}`;
    
    // 2. Library Setup
    console.log('Testing Library Setup...');
    const setupRes = await axios.post(`${API_URL}/library/setup`, {
      name: 'Central Library',
      ownerName: 'Test User',
      phone: '1234567890',
      address: '123 Main St, City',
      totalSeats: 50,
      defaultMonthlyFee: 500,
      openingTime: '08:00',
      closingTime: '22:00'
    });
    console.log('Library Setup Successful');

    console.log('Testing Login to get token with libraryId...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: signupRes.data.data.user.email,
      password: 'password123'
    });
    token = loginRes.data.data?.accessToken || loginRes.data.data?.token || loginRes.data.token;
    console.log('Login Successful.');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // 3. Generate Seats
    console.log('Testing Generate Seats...');
    await axios.post(`${API_URL}/seats/generate`, { totalSeats: 10 });
    console.log('Generate Seats Successful');

    // Get a seat ID
    const seatsRes = await axios.get(`${API_URL}/seats`);
    seatId = seatsRes.data.data[0].id;

    // 4. Create Student
    console.log('Testing Create Student...');
    const studentRes = await axios.post(`${API_URL}/students`, {
      name: 'John Doe',
      phone: '9876543210',
      monthlyFee: 1000,
      subscriptionStartDate: new Date().toISOString(),
      subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    });
    studentId = studentRes.data.data.id;
    console.log('Create Student Successful');

    // 5. Assign Seat
    console.log('Testing Assign Seat...');
    await axios.patch(`${API_URL}/seats/${seatId}/assign`, { studentId });
    console.log('Assign Seat Successful');

    // 6. Record Payment
    console.log('Testing Record Payment...');
    await axios.post(`${API_URL}/payments`, {
      studentId,
      amount: 1000,
      paymentMethod: 'CASH',
      monthCovered: new Date().toISOString()
    });
    console.log('Record Payment Successful');

    // 7. Dashboard Metrics
    console.log('Testing Dashboard Metrics...');
    const dashRes = await axios.get(`${API_URL}/dashboard`);
    if (!dashRes.data.data) throw new Error('Dashboard data empty');
    console.log('Dashboard Metrics Successful');

    console.log('\n✅ ALL E2E TESTS PASSED!');
  } catch (error) {
    console.error('\n❌ TEST FAILED:');
    if (error.response) {
      console.error(error.response.status, JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
    process.exit(1);
  }
}

runTests();
