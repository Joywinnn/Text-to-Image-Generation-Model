// Migration script to fix users without isDeleted field
// Run with: node fix-user-schema.js

const mongoose = require('mongoose');

// Connect to MongoDB (update with your connection string)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/imagify';

async function fixUserSchema() {
    try {
        console.log('🔧 Fixing User Schema...\n');

        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Define user schema (same as in your model)
        const userSchema = new mongoose.Schema({
            name: { type: String, required: true },
            email: { type: String, required: true, unique: true },
            password: { type: String, required: true },
            creditBalance: { type: Number, default: 5 },
            profilePicture: { type: String, default: null },
            createdAt: { type: Date, default: Date.now },
            role: { type: String, enum: ['user', 'admin'], default: 'user' },
            isDeleted: { type: Boolean, default: false }
        });

        const User = mongoose.model('user', userSchema);

        // Find users without isDeleted field
        const usersWithoutField = await User.find({ isDeleted: { $exists: false } });
        console.log(`📋 Found ${usersWithoutField.length} users without isDeleted field`);

        if (usersWithoutField.length > 0) {
            console.log('\n📝 Users that need to be updated:');
            usersWithoutField.forEach(user => {
                console.log(`   - ${user.name} (${user.email}) - Role: ${user.role || 'user'}`);
            });

            // Update all users without isDeleted field
            const result = await User.updateMany(
                { isDeleted: { $exists: false } },
                { $set: { isDeleted: false } }
            );

            console.log(`\n✅ Updated ${result.modifiedCount} users`);
            console.log('   All users now have isDeleted: false (active)');
        } else {
            console.log('\n✅ All users already have the isDeleted field');
        }

        // Verify the fix
        console.log('\n🔍 Verifying the fix...');
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ isDeleted: false });
        const deletedUsers = await User.countDocuments({ isDeleted: true });
        const usersWithoutFieldAfter = await User.countDocuments({ isDeleted: { $exists: false } });

        console.log('📊 Final counts:');
        console.log(`   Total users: ${totalUsers}`);
        console.log(`   Active users: ${activeUsers}`);
        console.log(`   Deleted users: ${deletedUsers}`);
        console.log(`   Users without isDeleted field: ${usersWithoutFieldAfter}`);

        if (usersWithoutFieldAfter === 0) {
            console.log('\n🎉 All users have been properly updated!');
        } else {
            console.log('\n⚠️  Some users still need attention');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from MongoDB');
    }
}

fixUserSchema(); 