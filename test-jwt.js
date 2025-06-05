const jwt = require('jsonwebtoken');

const testUser = {
  email: "jeff@ibam.org",
  firstName: "Jeff",
  lastName: "Tester", 
  systemIOUserId: "test123",
  subscriptionStatus: "trial",
  courseAccess: ["ibam-fundamentals"],
  iss: "system.io"
};

const secret = "systemio_ibam_shared_secret_key_2025";
const token = jwt.sign(testUser, secret, { expiresIn: '1h' });

console.log('Test this URL:');
console.log(`https://ibam-learning-platform-p7yw.vercel.app/auth/sso?token=${token}`);
