// Script to create an admin user
// Run with: node create-admin.js

const axios = require('axios');

async function createAdmin() {
    try {
        // 1. Register a new user
        const registerResponse = await axios.post('http://localhost:4000/api/user/register', {
            name: 'Admin User',
            email: 'admin@test.com',
            password: 'admin123'
        });

        if (registerResponse.data.success) {
            console.log('✅ User registered successfully');
            console.log('User ID:', registerResponse.data.user._id);
            
            // 2. Update user role to admin (you'll need to do this manually in MongoDB)
            console.log('\n⚠️  IMPORTANT: Update user role in MongoDB:');
            console.log('1. Go to your MongoDB database');
            console.log('2. Find user with email: admin@test.com');
            console.log('3. Update the role field to: "admin"');
            console.log('4. Then login with admin@test.com / admin123');
            
        } else {
            console.log('❌ Registration failed:', registerResponse.data.message);
        }
    } catch (error) {
        console.log('❌ Error:', error.response?.data || error.message);
    }
}

createAdmin(); 