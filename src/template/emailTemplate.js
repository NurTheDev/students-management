/**
 * Email Template Generator
 * Professional, responsive HTML email templates
 */

// ==========================================
// Brand Configuration
// ==========================================

const brandConfig = {
    name: process.env.APP_NAME || 'StudentHub',
    logo: process.env.APP_LOGO_URL || 'https://your-cdn.com/logo.png',
    primaryColor: '#4F46E5', // Indigo
    secondaryColor: '#7C3AED', // Violet
    textColor: '#1F2937',
    lightTextColor: '#6B7280',
    backgroundColor: '#F9FAFB',
    cardBackground: '#FFFFFF',
    successColor: '#10B981',
    warningColor: '#F59E0B',
    errorColor: '#EF4444',
    footerText: '© 2026 StudentHub. All rights reserved.',
    supportEmail: process.env.SUPPORT_EMAIL || 'support@studenthub.com',
    website: process.env.FRONTEND_URL || 'https://studenthub.com',
    address: process.env.COMPANY_ADDRESS || '123 Education Street, Tech City, TC 12345',
};

// ==========================================
// Base Template Wrapper
// ==========================================

const baseTemplate = (content, preheader = '') => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>${brandConfig.name}</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style>
        /* Reset styles */
        body, table, td, p, a, li, blockquote {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        table, td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }
        img {
            -ms-interpolation-mode: bicubic;
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
        }
        
        /* Base styles */
        body {
            margin: 0 !important;
            padding: 0 !important;
            background-color: ${brandConfig.backgroundColor};
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }
        
        /* Link styles */
        a {
            color: ${brandConfig.primaryColor};
            text-decoration: none;
        }
        
        /* Button styles */
        .button {
            display: inline-block;
            padding: 16px 32px;
            background: linear-gradient(135deg, ${brandConfig.primaryColor} 0%, ${brandConfig.secondaryColor} 100%);
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            transition: transform 0.2s ease;
        }
        
        .button:hover {
            transform: translateY(-2px);
        }
        
        .button-secondary {
            background: transparent;
            border: 2px solid ${brandConfig.primaryColor};
            color: ${brandConfig.primaryColor} !important;
        }
        
        /* Responsive styles */
        @media only screen and (max-width: 600px) {
            .container {
                width: 100% !important;
                padding: 0 16px !important;
            }
            .content {
                padding: 24px !important;
            }
            .button {
                display: block !important;
                width: 100% !important;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: ${brandConfig.backgroundColor};">
    <!-- Preheader text (hidden) -->
    <div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">
        ${preheader}
        &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
    </div>
    
    <!-- Email wrapper -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: ${brandConfig.backgroundColor};">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <!-- Container -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="container" style="max-width: 600px; width: 100%;">
                    
                    <!-- Header with Logo -->
                    <tr>
                        <td align="center" style="padding: 0 0 32px 0;">
                            <a href="${brandConfig.website}" target="_blank">
                                <img src="${brandConfig.logo}" alt="${brandConfig.name}" width="180" style="display: block; max-width: 180px; height: auto;">
                            </a>
                        </td>
                    </tr>
                    
                    <!-- Main Content Card -->
                    <tr>
                        <td>
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: ${brandConfig.cardBackground}; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
                                <tr>
                                    <td class="content" style="padding: 48px;">
                                        ${content}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 32px 0;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td align="center" style="padding-bottom: 16px;">
                                        <!-- Social Links -->
                                        <a href="#" style="display: inline-block; margin: 0 8px;">
                                            <img src="https://cdn-icons-png.flaticon.com/32/733/733547.png" alt="Facebook" width="24" height="24">
                                        </a>
                                        <a href="#" style="display: inline-block; margin: 0 8px;">
                                            <img src="https://cdn-icons-png.flaticon.com/32/733/733579.png" alt="Twitter" width="24" height="24">
                                        </a>
                                        <a href="#" style="display: inline-block; margin: 0 8px;">
                                            <img src="https://cdn-icons-png.flaticon.com/32/733/733561.png" alt="LinkedIn" width="24" height="24">
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="color: ${brandConfig.lightTextColor}; font-size: 14px; line-height: 1.6;">
                                        <p style="margin: 0 0 8px 0;">${brandConfig.footerText}</p>
                                        <p style="margin: 0 0 8px 0;">${brandConfig.address}</p>
                                        <p style="margin: 0;">
                                            <a href="mailto:${brandConfig.supportEmail}" style="color: ${brandConfig.primaryColor};">Contact Support</a>
                                            &nbsp;•&nbsp;
                                            <a href="${brandConfig.website}/privacy" style="color: ${brandConfig.primaryColor};">Privacy Policy</a>
                                            &nbsp;•&nbsp;
                                            <a href="${brandConfig.website}/terms" style="color: ${brandConfig.primaryColor};">Terms of Service</a>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

// ==========================================
// Role Badge Colors
// ==========================================

const getRoleBadge = (role) => {
    const roleColors = {
        ADMIN: { bg: '#FEE2E2', text: '#991B1B', label: 'Administrator' },
        TEACHER: { bg: '#DBEAFE', text: '#1E40AF', label: 'Teacher' },
        STAFF: { bg: '#D1FAE5', text: '#065F46', label: 'Staff Member' },
        STUDENT: { bg: '#E0E7FF', text: '#3730A3', label: 'Student' },
    };

    const config = roleColors[role] || roleColors.STUDENT;

    return `
        <span style="
            display: inline-block;
            padding: 6px 16px;
            background-color: ${config.bg};
            color: ${config.text};
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        ">${config.label}</span>
    `;
};

// ==========================================
// Invite Email Template
// ==========================================

const inviteTemplate = ({
                            recipientName = null,
                            role,
                            inviterName = 'Your Team Member',
                            instituteName = "the company",
                            inviteUrl,
                            expiresAt,
                            customMessage = null,
    token,
                        }) => {
    const greeting = recipientName ? `Hello ${recipientName}` : 'Hello';
    const expiryDate = new Date(expiresAt);
    const formattedExpiry = expiryDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    const content = `
        <!-- Icon -->
        <div style="text-align: center; margin-bottom: 32px;">
            <div style="
                display: inline-block;
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, ${brandConfig.primaryColor}20 0%, ${brandConfig.secondaryColor}20 100%);
                border-radius: 50%;
                padding: 20px;
            ">
                <img src="https://cdn-icons-png.flaticon.com/64/3596/3596165.png" alt="Invitation" width="40" height="40" style="display: block;">
            </div>
        </div>
        
        <!-- Heading -->
        <h1 style="
            margin: 0 0 8px 0;
            font-size: 28px;
            font-weight: 700;
            color: ${brandConfig.textColor};
            text-align: center;
        ">You're Invited! 🎉</h1>
        
        <p style="
            margin: 0 0 32px 0;
            font-size: 16px;
            color: ${brandConfig.lightTextColor};
            text-align: center;
        ">Join ${instituteName} on ${brandConfig.name}</p>
        
        <!-- Divider -->
        <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 0 0 32px 0;">
        
        <!-- Greeting -->
        <p style="
            margin: 0 0 16px 0;
            font-size: 18px;
            color: ${brandConfig.textColor};
        ">${greeting},</p>
        
        <!-- Main message -->
        <p style="
            margin: 0 0 24px 0;
            font-size: 16px;
            line-height: 1.6;
            color: ${brandConfig.textColor};
        ">
            <strong>${inviterName}</strong> has invited you to join 
            <strong>${instituteName}</strong> as a member of their team.
        </p>
        
        <!-- Role Badge -->
        <div style="
            background-color: #F9FAFB;
            border-radius: 12px;
            padding: 24px;
            margin: 0 0 24px 0;
            text-align: center;
        ">
            <p style="margin: 0 0 12px 0; font-size: 14px; color: ${brandConfig.lightTextColor};">
                You'll be joining as:
            </p>
            ${getRoleBadge(role)}
        </div>
        
        ${customMessage ? `
        <!-- Custom Message -->
        <div style="
            background-color: #FEF3C7;
            border-left: 4px solid #F59E0B;
            border-radius: 0 8px 8px 0;
            padding: 16px 20px;
            margin: 0 0 24px 0;
        ">
            <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 600; color: #92400E; text-transform: uppercase;">
                Message from ${inviterName}:
            </p>
            <p style="margin: 0; font-size: 15px; color: #78350F; font-style: italic;">
                "${customMessage}"
            </p>
        </div>
        ` : ''}
        
        <!-- CTA Button -->
        <div style="text-align: center; margin: 32px 0;">
            <a href="${inviteUrl}" class="button" style="
                display: inline-block;
                padding: 16px 48px;
                background: linear-gradient(135deg, ${brandConfig.primaryColor} 0%, ${brandConfig.secondaryColor} 100%);
                color: #ffffff;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                font-size: 16px;
            ">Accept Invitation</a>
        </div>
        
        <!-- Expiry Warning -->
        <div style="
            background-color: #FEF2F2;
            border-radius: 8px;
            padding: 16px;
            margin: 0 0 24px 0;
            text-align: center;
        ">
            <p style="margin: 0; font-size: 14px; color: #991B1B;">
                ⏰ This invitation expires on <strong>${formattedExpiry}</strong>
            </p>
        </div>
        
        <!-- Alternative Link -->
        <p style="
            margin: 0 0 8px 0;
            font-size: 13px;
            color: ${brandConfig.lightTextColor};
            text-align: center;
        ">
            If the button doesn't work, copy and paste this token into the registration page:
        </p>
        <p style="
            margin: 0 0 24px 0;
            font-size: 12px;
            color: ${brandConfig.primaryColor};
            text-align: center;
            word-break: break-all;
            background-color: #F3F4F6;
            padding: 12px;
            border-radius: 6px;
        ">
            ${token}
        </p>
        
        <!-- Help Section -->
        <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 32px 0 24px 0;">
        
        <p style="
            margin: 0;
            font-size: 14px;
            color: ${brandConfig.lightTextColor};
            text-align: center;
        ">
            Questions? Contact us at 
            <a href="mailto:${brandConfig.supportEmail}" style="color: ${brandConfig.primaryColor};">${brandConfig.supportEmail}</a>
        </p>
    `;

    const preheader = `${inviterName} invited you to join ${instituteName} as ${role}. Accept your invitation now!`;

    return baseTemplate(content, preheader);
};

// ==========================================
// Welcome Email Template (After Registration)
// ==========================================

const welcomeTemplate = ({
                             userName,
                             role,
                             instituteName = "the company",
                             loginUrl,
                         }) => {
    const content = `
        <!-- Icon -->
        <div style="text-align: center; margin-bottom: 32px;">
            <div style="
                display: inline-block;
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, ${brandConfig.successColor}20 0%, #34D39920 100%);
                border-radius: 50%;
                padding: 20px;
            ">
                <img src="https://cdn-icons-png.flaticon.com/64/190/190411.png" alt="Welcome" width="40" height="40" style="display: block;">
            </div>
        </div>
        
        <!-- Heading -->
        <h1 style="
            margin: 0 0 8px 0;
            font-size: 28px;
            font-weight: 700;
            color: ${brandConfig.textColor};
            text-align: center;
        ">Welcome Aboard! 🚀</h1>
        
        <p style="
            margin: 0 0 32px 0;
            font-size: 16px;
            color: ${brandConfig.lightTextColor};
            text-align: center;
        ">Your account has been successfully created</p>
        
        <!-- Divider -->
        <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 0 0 32px 0;">
        
        <!-- Greeting -->
        <p style="
            margin: 0 0 16px 0;
            font-size: 18px;
            color: ${brandConfig.textColor};
        ">Hi ${userName},</p>
        
        <!-- Main message -->
        <p style="
            margin: 0 0 24px 0;
            font-size: 16px;
            line-height: 1.6;
            color: ${brandConfig.textColor};
        ">
            Welcome to <strong>${instituteName}</strong>! Your account has been successfully created 
            and you're all set to start using ${brandConfig.name}.
        </p>
        
        <!-- Account Info Box -->
        <div style="
            background-color: #F0FDF4;
            border: 1px solid #86EFAC;
            border-radius: 12px;
            padding: 24px;
            margin: 0 0 24px 0;
        ">
            <h3 style="margin: 0 0 16px 0; font-size: 16px; color: ${brandConfig.textColor};">
                📋 Your Account Details
            </h3>
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                    <td style="padding: 8px 0; font-size: 14px; color: ${brandConfig.lightTextColor};">Organization:</td>
                    <td style="padding: 8px 0; font-size: 14px; color: ${brandConfig.textColor}; text-align: right;"><strong>${instituteName}</strong></td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-size: 14px; color: ${brandConfig.lightTextColor};">Your Role:</td>
                    <td style="padding: 8px 0; text-align: right;">${getRoleBadge(role)}</td>
                </tr>
            </table>
        </div>
        
        <!-- What's Next Section -->
        <h3 style="margin: 0 0 16px 0; font-size: 18px; color: ${brandConfig.textColor};">
            What's Next?
        </h3>
        
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 24px;">
            <tr>
                <td style="padding: 12px 0; vertical-align: top;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                            <td style="padding-right: 16px; vertical-align: top;">
                                <div style="
                                    width: 32px;
                                    height: 32px;
                                    background: ${brandConfig.primaryColor};
                                    border-radius: 50%;
                                    text-align: center;
                                    line-height: 32px;
                                    color: white;
                                    font-weight: bold;
                                    font-size: 14px;
                                ">1</div>
                            </td>
                            <td>
                                <p style="margin: 0 0 4px 0; font-size: 15px; font-weight: 600; color: ${brandConfig.textColor};">Complete Your Profile</p>
                                <p style="margin: 0; font-size: 14px; color: ${brandConfig.lightTextColor};">Add a profile picture and update your information</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td style="padding: 12px 0; vertical-align: top;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                            <td style="padding-right: 16px; vertical-align: top;">
                                <div style="
                                    width: 32px;
                                    height: 32px;
                                    background: ${brandConfig.primaryColor};
                                    border-radius: 50%;
                                    text-align: center;
                                    line-height: 32px;
                                    color: white;
                                    font-weight: bold;
                                    font-size: 14px;
                                ">2</div>
                            </td>
                            <td>
                                <p style="margin: 0 0 4px 0; font-size: 15px; font-weight: 600; color: ${brandConfig.textColor};">Explore the Dashboard</p>
                                <p style="margin: 0; font-size: 14px; color: ${brandConfig.lightTextColor};">Familiarize yourself with the tools and features</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td style="padding: 12px 0; vertical-align: top;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                            <td style="padding-right: 16px; vertical-align: top;">
                                <div style="
                                    width: 32px;
                                    height: 32px;
                                    background: ${brandConfig.primaryColor};
                                    border-radius: 50%;
                                    text-align: center;
                                    line-height: 32px;
                                    color: white;
                                    font-weight: bold;
                                    font-size: 14px;
                                ">3</div>
                            </td>
                            <td>
                                <p style="margin: 0 0 4px 0; font-size: 15px; font-weight: 600; color: ${brandConfig.textColor};">Connect with Your Team</p>
                                <p style="margin: 0; font-size: 14px; color: ${brandConfig.lightTextColor};">Start collaborating with other members</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        
        <!-- CTA Button -->
        <div style="text-align: center; margin: 32px 0;">
            <a href="${loginUrl}" class="button" style="
                display: inline-block;
                padding: 16px 48px;
                background: linear-gradient(135deg, ${brandConfig.primaryColor} 0%, ${brandConfig.secondaryColor} 100%);
                color: #ffffff;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                font-size: 16px;
            ">Go to Dashboard</a>
        </div>
        
        <!-- Help Section -->
        <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 32px 0 24px 0;">
        
        <p style="
            margin: 0;
            font-size: 14px;
            color: ${brandConfig.lightTextColor};
            text-align: center;
        ">
            Need help getting started? Check out our 
            <a href="${brandConfig.website}/docs" style="color: ${brandConfig.primaryColor};">documentation</a>
            or contact 
            <a href="mailto:${brandConfig.supportEmail}" style="color: ${brandConfig.primaryColor};">support</a>
        </p>
    `;

    const preheader = `Welcome to ${instituteName}! Your account is ready. Let's get started!`;

    return baseTemplate(content, preheader);
};

// ==========================================
// Password Reset Email Template
// ==========================================

const passwordResetTemplate = ({
                                   userName,
                                   resetUrl,
                                   expiresIn = '1 hour',
                               }) => {
    const content = `
        <!-- Icon -->
        <div style="text-align: center; margin-bottom: 32px;">
            <div style="
                display: inline-block;
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, ${brandConfig.warningColor}20 0%, #FBBF2420 100%);
                border-radius: 50%;
                padding: 20px;
            ">
                <img src="https://cdn-icons-png.flaticon.com/64/6195/6195699.png" alt="Password Reset" width="40" height="40" style="display: block;">
            </div>
        </div>
        
        <!-- Heading -->
        <h1 style="
            margin: 0 0 8px 0;
            font-size: 28px;
            font-weight: 700;
            color: ${brandConfig.textColor};
            text-align: center;
        ">Reset Your Password</h1>
        
        <p style="
            margin: 0 0 32px 0;
            font-size: 16px;
            color: ${brandConfig.lightTextColor};
            text-align: center;
        ">We received a request to reset your password</p>
        
        <!-- Divider -->
        <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 0 0 32px 0;">
        
        <!-- Greeting -->
        <p style="
            margin: 0 0 16px 0;
            font-size: 18px;
            color: ${brandConfig.textColor};
        ">Hi ${userName},</p>
        
        <!-- Main message -->
        <p style="
            margin: 0 0 24px 0;
            font-size: 16px;
            line-height: 1.6;
            color: ${brandConfig.textColor};
        ">
            We received a request to reset your password for your ${brandConfig.name} account. 
            Click the button below to create a new password.
        </p>
        
        <!-- CTA Button -->
        <div style="text-align: center; margin: 32px 0;">
            <a href="${resetUrl}" class="button" style="
                display: inline-block;
                padding: 16px 48px;
                background: linear-gradient(135deg, ${brandConfig.warningColor} 0%, #F97316 100%);
                color: #ffffff;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                font-size: 16px;
            ">Reset Password</a>
        </div>
        
        <!-- Expiry Warning -->
        <div style="
            background-color: #FEF3C7;
            border-radius: 8px;
            padding: 16px;
            margin: 0 0 24px 0;
            text-align: center;
        ">
            <p style="margin: 0; font-size: 14px; color: #92400E;">
                ⏰ This link will expire in <strong>${expiresIn}</strong>
            </p>
        </div>
        
        <!-- Security Notice -->
        <div style="
            background-color: #F3F4F6;
            border-radius: 8px;
            padding: 16px;
            margin: 0 0 24px 0;
        ">
            <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: ${brandConfig.textColor};">
                🔒 Security Notice
            </p>
            <p style="margin: 0; font-size: 14px; color: ${brandConfig.lightTextColor}; line-height: 1.5;">
                If you didn't request this password reset, please ignore this email or 
                <a href="mailto:${brandConfig.supportEmail}" style="color: ${brandConfig.primaryColor};">contact support</a> 
                if you have concerns about your account security.
            </p>
        </div>
        
        <!-- Alternative Link -->
        <p style="
            margin: 0 0 8px 0;
            font-size: 13px;
            color: ${brandConfig.lightTextColor};
            text-align: center;
        ">
            If the button doesn't work, copy and paste this link:
        </p>
        <p style="
            margin: 0;
            font-size: 12px;
            color: ${brandConfig.primaryColor};
            text-align: center;
            word-break: break-all;
            background-color: #F3F4F6;
            padding: 12px;
            border-radius: 6px;
        ">
            ${resetUrl}
        </p>
    `;

    const preheader = `Reset your ${brandConfig.name} password. This link expires in ${expiresIn}.`;

    return baseTemplate(content, preheader);
};

// ==========================================
// Invite Reminder Template
// ==========================================

const inviteReminderTemplate = ({
                                    recipientName = null,
                                    role,
                                    inviterName,
                                    instituteName,
                                    inviteUrl,
                                    expiresAt,
                                    daysRemaining,
                                }) => {
    const greeting = recipientName ? `Hi ${recipientName}` : 'Hi there';
    const expiryDate = new Date(expiresAt);
    const formattedExpiry = expiryDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const urgencyColor = daysRemaining <= 1 ? brandConfig.errorColor : brandConfig.warningColor;
    const urgencyBg = daysRemaining <= 1 ? '#FEE2E2' : '#FEF3C7';
    const urgencyText = daysRemaining <= 1
        ? '⚠️ Last chance! Your invitation expires very soon!'
        : `⏰ Only ${daysRemaining} day${daysRemaining > 1 ? 's' : ''} left to accept`;

    const content = `
        <!-- Urgency Banner -->
        <div style="
            background-color: ${urgencyBg};
            border-radius: 8px;
            padding: 16px;
            margin: 0 0 32px 0;
            text-align: center;
        ">
            <p style="margin: 0; font-size: 16px; font-weight: 600; color: ${urgencyColor};">
                ${urgencyText}
            </p>
        </div>
        
        <!-- Icon -->
        <div style="text-align: center; margin-bottom: 32px;">
            <div style="
                display: inline-block;
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, ${brandConfig.primaryColor}20 0%, ${brandConfig.secondaryColor}20 100%);
                border-radius: 50%;
                padding: 20px;
            ">
                <img src="https://cdn-icons-png.flaticon.com/64/1827/1827379.png" alt="Reminder" width="40" height="40" style="display: block;">
            </div>
        </div>
        
        <!-- Heading -->
        <h1 style="
            margin: 0 0 32px 0;
            font-size: 28px;
            font-weight: 700;
            color: ${brandConfig.textColor};
            text-align: center;
        ">Don't Miss Out! 📬</h1>
        
        <!-- Greeting -->
        <p style="
            margin: 0 0 16px 0;
            font-size: 18px;
            color: ${brandConfig.textColor};
        ">${greeting},</p>
        
        <!-- Main message -->
        <p style="
            margin: 0 0 24px 0;
            font-size: 16px;
            line-height: 1.6;
            color: ${brandConfig.textColor};
        ">
            This is a friendly reminder that <strong>${inviterName}</strong> invited you to join 
            <strong>${instituteName}</strong> as a <strong>${role.toLowerCase()}</strong>. 
            Your invitation is waiting!
        </p>
        
        <!-- CTA Button -->
        <div style="text-align: center; margin: 32px 0;">
            <a href="${inviteUrl}" class="button" style="
                display: inline-block;
                padding: 16px 48px;
                background: linear-gradient(135deg, ${brandConfig.primaryColor} 0%, ${brandConfig.secondaryColor} 100%);
                color: #ffffff;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                font-size: 16px;
            ">Accept Invitation Now</a>
        </div>
        
        <!-- Expiry Info -->
        <p style="
            margin: 0;
            font-size: 14px;
            color: ${brandConfig.lightTextColor};
            text-align: center;
        ">
            Invitation expires on <strong>${formattedExpiry}</strong>
        </p>
    `;

    const preheader = `Reminder: Your invitation to join ${instituteName} expires in ${daysRemaining} day${daysRemaining > 1 ? 's' : ''}!`;

    return baseTemplate(content, preheader);
};

// ==========================================
// Plain Text Versions (for email clients that don't support HTML)
// ==========================================

const inviteTemplatePlain = ({
                                 recipientName = null,
                                 role,
                                 inviterName,
                                 instituteName,
                                 inviteUrl,
                                 expiresAt,
                                 customMessage = null,
                             }) => {
    const greeting = recipientName ? `Hello ${recipientName}` : 'Hello';
    const expiryDate = new Date(expiresAt);
    const formattedExpiry = expiryDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    return `
${greeting},

You've been invited to join ${instituteName} on ${brandConfig.name}!

${inviterName} has invited you to join as a ${role}.

${customMessage ? `Message from ${inviterName}: "${customMessage}"\n` : ''}
To accept this invitation, please visit:
${inviteUrl}

⏰ This invitation expires on ${formattedExpiry}

If you have any questions, please contact us at ${brandConfig.supportEmail}

Best regards,
The ${brandConfig.name} Team

---
${brandConfig.footerText}
${brandConfig.address}
    `.trim();
};

// ==========================================
// Export All Templates
// ==========================================

module.exports = {
    // Configuration
    brandConfig,

    // HTML Templates
    inviteTemplate,
    welcomeTemplate,
    passwordResetTemplate,
    inviteReminderTemplate,

    // Plain Text Templates
    inviteTemplatePlain,

    // Utilities
    baseTemplate,
    getRoleBadge,
};