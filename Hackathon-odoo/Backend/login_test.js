const axios = require('axios');
(async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/login', {
      email: 'admin@vendorbridge.com',
      password: 'Admin@123'
    }, { headers: { 'Content-Type': 'application/json' } });
    console.log('Response:', response.data);
  } catch (err) {
    if (err.response) {
      console.error('Error status:', err.response.status);
      console.error('Error data:', err.response.data);
    } else {
      console.error('Error:', err.message);
    }
  }
})();
