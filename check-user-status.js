// Script to check user status and diagnose admin dashboard issues
// Run with: node check-user-status.js

const axios = require('axios');

const BASE_URL = 'http://localhost:4000/api/user';

async function checkUserStatus() {
    try {
        console.log('🔍 Checking User Status...\n');

        // 1. Login as admin
        console.log('1. Logging in as admin...');
        const loginResponse = await axios.post(`${BASE_URL}/login`, {
            email: 'admin@example.com',
            password: 'admin123'
        });

        if (!loginResponse.data.success) {
            console.log('❌ Admin login failed:', loginResponse.data.message);
            return;
        }

        const token = loginResponse.data.token;
        console.log('✅ Admin login successful');

        // 2. Get admin stats
        console.log('\n2. Getting admin stats...');
        const statsResponse = await axios.get(`${BASE_URL}/admin/stats`, {
            headers: { token }
        });
        const stats = statsResponse.data;
        console.log('📊 Stats:', {
            totalUsers: stats.totalUsers,
            activeUsers: stats.activeUsers,
            deletedUsers: stats.deletedUsers
        });

        // 3. Get all users (including deleted)
        console.log('\n3. Getting all users (including deleted)...');
        const allUsersResponse = await axios.get(`${BASE_URL}/admin/users?showDeleted=true`, {
            headers: { token }
        });
        const allUsers = allUsersResponse.data.users;
        console.log(`📋 Total users in database: ${allUsers.length}`);

        // 4. Analyze each user
        console.log('\n4. Analyzing each user:');
        console.log('┌─────────────────────────────────────────────────────────────────────────────┐');
        console.log('│ Name                │ Email               │ Role   │ isDeleted │ Created    │');
        console.log('├─────────────────────────────────────────────────────────────────────────────┤');

        allUsers.forEach(user => {
            const name = user.name.padEnd(20);
            const email = user.email.padEnd(20);
            const role = (user.role || 'user').padEnd(7);
            const isDeleted = user.isDeleted ? 'true' : 'false';
            const created = new Date(user.createdAt).toLocaleDateString();
            
            console.log(`│ ${name} │ ${email} │ ${role} │ ${isDeleted.padEnd(9)} │ ${created} │`);
        });
        console.log('└─────────────────────────────────────────────────────────────────────────────┘');

        // 5. Check for users without isDeleted field
        const usersWithoutField = allUsers.filter(user => user.isDeleted === undefined);
        if (usersWithoutField.length > 0) {
            console.log('\n⚠️  USERS WITHOUT isDeleted FIELD:');
            usersWithoutField.forEach(user => {
                console.log(`   - ${user.name} (${user.email})`);
            });
            console.log('\n💡 These users might be causing the discrepancy. They need to be updated.');
        }

        // 6. Check for soft-deleted users
        const deletedUsers = allUsers.filter(user => user.isDeleted === true);
        if (deletedUsers.length > 0) {
            console.log('\n🗑️  SOFT-DELETED USERS:');
            deletedUsers.forEach(user => {
                console.log(`   - ${user.name} (${user.email})`);
            });
        }

        // 7. Check for active users
        const activeUsers = allUsers.filter(user => user.isDeleted === false);
        console.log('\n✅ ACTIVE USERS:');
        activeUsers.forEach(user => {
            console.log(`   - ${user.name} (${user.email}) - Role: ${user.role || 'user'}`);
        });

        // 8. Summary
        console.log('\n📈 SUMMARY:');
        console.log(`   Total users in database: ${allUsers.length}`);
        console.log(`   Active users (isDeleted: false): ${activeUsers.length}`);
        console.log(`   Deleted users (isDeleted: true): ${deletedUsers.length}`);
        console.log(`   Users without isDeleted field: ${usersWithoutField.length}`);
        console.log(`   Stats API says active users: ${stats.activeUsers}`);
        
        if (activeUsers.length !== stats.activeUsers) {
            console.log('\n❌ DISCREPANCY DETECTED!');
            console.log(`   Expected: ${activeUsers.length} active users`);
            console.log(`   Actual: ${stats.activeUsers} active users`);
            console.log('   This might be due to users without the isDeleted field.');
        }

    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

checkUserStatus(); 