// Test script for admin functionality
// Run with: node test-admin.js

const axios = require('axios');

const BASE_URL = 'http://localhost:4000/api/user';

// Test data
const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
};

const adminUser = {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123'
};

async function testAdminFunctionality() {
    try {
        console.log('🧪 Testing Admin Functionality...\n');

        // 1. Register a regular user
        console.log('1. Registering test user...');
        const userResponse = await axios.post(`${BASE_URL}/register`, testUser);
        const userToken = userResponse.data.token;
        const userId = userResponse.data.user._id;
        console.log('✅ Test user registered');

        // 2. Register an admin user
        console.log('\n2. Registering admin user...');
        const adminResponse = await axios.post(`${BASE_URL}/register`, adminUser);
        const adminToken = adminResponse.data.token;
        const adminId = adminResponse.data.user._id;
        console.log('✅ Admin user registered');

        // 3. Update admin user role (you'll need to do this manually in MongoDB)
        console.log('\n3. ⚠️  IMPORTANT: Update admin user role in MongoDB:');
        console.log(`   Update user with ID: ${adminId}`);
        console.log('   Set role: "admin"');
        console.log('   Then press Enter to continue...');
        
        // Wait for user input
        await new Promise(resolve => {
            process.stdin.once('data', resolve);
        });

        // 4. Test admin stats endpoint
        console.log('\n4. Testing admin stats...');
        const statsResponse = await axios.get(`${BASE_URL}/admin/stats`, {
            headers: { token: adminToken }
        });
        console.log('✅ Admin stats:', statsResponse.data);

        // 5. Test get all users
        console.log('\n5. Testing get all users...');
        const usersResponse = await axios.get(`${BASE_URL}/admin/users`, {
            headers: { token: adminToken }
        });
        console.log('✅ Users retrieved:', usersResponse.data.users.length, 'users');

        // 6. Test soft delete user
        console.log('\n6. Testing soft delete user...');
        const deleteResponse = await axios.put(`${BASE_URL}/admin/soft-delete`, {
            userId: userId
        }, {
            headers: { token: adminToken }
        });
        console.log('✅ User soft deleted');

        // 7. Test get deleted users
        console.log('\n7. Testing get deleted users...');
        const deletedUsersResponse = await axios.get(`${BASE_URL}/admin/users?showDeleted=true`, {
            headers: { token: adminToken }
        });
        console.log('✅ Deleted users retrieved:', deletedUsersResponse.data.users.length, 'users');

        // 8. Test restore user
        console.log('\n8. Testing restore user...');
        const restoreResponse = await axios.put(`${BASE_URL}/admin/restore-user`, {
            userId: userId
        }, {
            headers: { token: adminToken }
        });
        console.log('✅ User restored');

        console.log('\n🎉 All admin functionality tests passed!');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

// Run the test
testAdminFunctionality(); 