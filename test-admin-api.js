// Test script for admin API endpoints
// Run with: node test-admin-api.js

const axios = require('axios');

const BASE_URL = 'http://localhost:4000/api/user';

// Test admin functionality
async function testAdminAPI() {
    try {
        console.log('🧪 Testing Admin API Endpoints...\n');

        // 1. Login as admin
        console.log('1. Logging in as admin...');
        const loginResponse = await axios.post(`${BASE_URL}/login`, {
            email: 'admin@test.com',
            password: 'admin123'
        });

        if (!loginResponse.data.success) {
            console.log('❌ Login failed:', loginResponse.data.message);
            return;
        }

        const token = loginResponse.data.token;
        const user = loginResponse.data.user;
        console.log('✅ Login successful');
        console.log('User role:', user.role);

        if (user.role !== 'admin') {
            console.log('❌ User is not admin. Please update role in MongoDB.');
            return;
        }

        // 2. Test admin stats
        console.log('\n2. Testing admin stats...');
        const statsResponse = await axios.get(`${BASE_URL}/admin/stats`, {
            headers: { token }
        });
        console.log('✅ Stats response:', statsResponse.data);

        // 3. Test get users
        console.log('\n3. Testing get users...');
        const usersResponse = await axios.get(`${BASE_URL}/admin/users`, {
            headers: { token }
        });
        console.log('✅ Users response:', usersResponse.data);

        // 4. Test get deleted users
        console.log('\n4. Testing get deleted users...');
        const deletedUsersResponse = await axios.get(`${BASE_URL}/admin/users?showDeleted=true`, {
            headers: { token }
        });
        console.log('✅ Deleted users response:', deletedUsersResponse.data);

        console.log('\n🎉 All admin API tests passed!');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

// Run the test
testAdminAPI(); 