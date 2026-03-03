// Simple admin test - creates users and tests admin functionality
// Run with: node test-admin-simple.js

const axios = require('axios');

const BASE_URL = 'http://localhost:4000/api/user';

async function testAdminFunctionality() {
    try {
        console.log('🧪 Testing Admin Functionality...\n');

        // 1. Create a regular user
        console.log('1. Creating regular user...');
        const userResponse = await axios.post(`${BASE_URL}/register`, {
            name: 'Test User',
            email: 'testuser@example.com',
            password: 'password123'
        });
        
        if (!userResponse.data.success) {
            console.log('❌ User creation failed:', userResponse.data.message);
            return;
        }
        console.log('✅ Regular user created');

        // 2. Create an admin user
        console.log('\n2. Creating admin user...');
        const adminResponse = await axios.post(`${BASE_URL}/register`, {
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'admin123'
        });
        
        if (!adminResponse.data.success) {
            console.log('❌ Admin creation failed:', adminResponse.data.message);
            return;
        }
        console.log('✅ Admin user created');
        console.log('Admin user ID:', adminResponse.data.user._id);

        // 3. Manual step - update admin role in MongoDB
        console.log('\n3. ⚠️  MANUAL STEP REQUIRED:');
        console.log('   - Go to your MongoDB database');
        console.log('   - Find user with email: admin@example.com');
        console.log('   - Update the role field to: "admin"');
        console.log('   - Then press Enter to continue...');
        
        // Wait for user input
        await new Promise(resolve => {
            process.stdin.once('data', resolve);
        });

        // 4. Login as admin
        console.log('\n4. Logging in as admin...');
        const loginResponse = await axios.post(`${BASE_URL}/login`, {
            email: 'admin@example.com',
            password: 'admin123'
        });

        if (!loginResponse.data.success) {
            console.log('❌ Admin login failed:', loginResponse.data.message);
            return;
        }

        const token = loginResponse.data.token;
        const user = loginResponse.data.user;
        console.log('✅ Admin login successful');
        console.log('User role:', user.role);

        if (user.role !== 'admin') {
            console.log('❌ User is not admin. Please update role in MongoDB.');
            return;
        }

        // 5. Test admin stats
        console.log('\n5. Testing admin stats...');
        const statsResponse = await axios.get(`${BASE_URL}/admin/stats`, {
            headers: { token }
        });
        console.log('✅ Stats response:', statsResponse.data);

        // 6. Test get users
        console.log('\n6. Testing get users...');
        const usersResponse = await axios.get(`${BASE_URL}/admin/users`, {
            headers: { token }
        });
        console.log('✅ Users response:', usersResponse.data);

        // 7. Test role update
        console.log('\n7. Testing role update...');
        const roleResponse = await axios.put(`${BASE_URL}/admin/user-role`, {
            userId: userResponse.data.user._id,
            role: 'admin'
        }, {
            headers: { 
                'Content-Type': 'application/json',
                token 
            }
        });
        console.log('✅ Role update response:', roleResponse.data);

        // 8. Test soft delete
        console.log('\n8. Testing soft delete...');
        const deleteResponse = await axios.put(`${BASE_URL}/admin/soft-delete`, {
            userId: userResponse.data.user._id
        }, {
            headers: { 
                'Content-Type': 'application/json',
                token 
            }
        });
        console.log('✅ Soft delete response:', deleteResponse.data);

        // 9. Test restore
        console.log('\n9. Testing restore...');
        const restoreResponse = await axios.put(`${BASE_URL}/admin/restore-user`, {
            userId: userResponse.data.user._id
        }, {
            headers: { 
                'Content-Type': 'application/json',
                token 
            }
        });
        console.log('✅ Restore response:', restoreResponse.data);

        console.log('\n🎉 All admin functionality tests passed!');
        console.log('\n📝 Next steps:');
        console.log('1. Login to your app with admin@example.com / admin123');
        console.log('2. Go to /admin to see the dashboard');
        console.log('3. Test all features in the UI');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

testAdminFunctionality(); 