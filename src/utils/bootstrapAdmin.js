const mongoose = require('mongoose');
const User = require('../models/user.model');
const {CustomError} = require('../helpers/customError');

async function bootstrapAdmin() {
    try {
        const adminInfo = [
            'BOOTSTRAP_ADMIN_EMAIL',
            'BOOTSTRAP_ADMIN_PASSWORD',
            'BOOTSTRAP_ADMIN_NAME',
            'BOOTSTRAP_INSTITUTION_NAME'
        ]
        const missingEnvVars = adminInfo.filter(envVar => !process.env[envVar]);
        if (missingEnvVars.length > 0) {
            console.log(`Missing environment variables: ${missingEnvVars.join(', ')}`);
            console.log('Skipping admin bootstrap.');
            return {success: false, reason: 'missing_env_vars'};
            throw new CustomError(`Missing environment variables for admin bootstrap: ${missingEnvVars.join(', ')}`, 500);
        }
        // ==========================================
        // Check if admin already exists
        // ==========================================
        const adminExists = await User.exists({
            role: 'ADMIN',
            isDeleted: false
        });
        if (adminExists) {
            console.log('ℹ️  Admin already exists. Skipping bootstrap.');
            return {success: true, reason: 'already_exists'};
        }
        // ==========================================
        // Create admin user
        // ==========================================
        // ==========================================
        // Create admin user
        // ==========================================

        const admin = await User.create({
            name: process.env.BOOTSTRAP_ADMIN_NAME || 'System Admin',
            email: process.env.BOOTSTRAP_ADMIN_EMAIL.toLowerCase().trim(),
            password: process.env.BOOTSTRAP_ADMIN_PASSWORD,
            institute: process.env.BOOTSTRAP_INSTITUTION_NAME || 'Default Institution',
            role: 'ADMIN',
            status: 'ACTIVE',
            emailVerified: true,
            invitedAt: new Date()
        });

        console.log(`
✅ Bootstrap admin created successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 Email: ${admin.email}
👤 Name: ${admin.name}
🔑 Role: ${admin.role}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  IMPORTANT: Change the password after first login!
⚠️  Remove bootstrap credentials from environment after setup!
        `);

        return {
            success: true,
            reason: 'created',
            admin: {
                id: admin._id,
                email: admin.email,
                name: admin.name
            }
        };
    } catch (error) {
        console.error(error);
    }
}
module.exports = bootstrapAdmin;