function verifyEmailTemplate({ name, otp, expiresIn, companyName, verifyLink }) {
    const safeName = name || "there";
    const safeCompany = companyName || "Your Company";
    const safeExpires = expiresIn || "10 minutes";
    const safeLink = verifyLink || "#";

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <title>${safeCompany} - Email Verification</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f5f5f5;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 480px;
                    margin: 40px auto;
                    background: #ffffff;
                    border-radius: 8px;
                    padding: 24px 32px;
                    border: 1px solid #e5e5e5;
                }
                .company {
                    font-size: 14px;
                    font-weight: 600;
                    color: #3b82f6;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    margin-bottom: 8px;
                }
                .title {
                    font-size: 20px;
                    font-weight: 600;
                    margin-bottom: 12px;
                    color: #111827;
                }
                .text {
                    font-size: 14px;
                    color: #4b5563;
                    line-height: 1.5;
                    margin-bottom: 16px;
                }
                .otp-box {
                    display: inline-block;
                    padding: 10px 18px;
                    font-size: 20px;
                    font-weight: 700;
                    letter-spacing: 4px;
                    color: #111827;
                    background-color: #f3f4f6;
                    border-radius: 6px;
                    border: 1px dashed #9ca3af;
                    margin: 16px 0;
                }
                .btn {
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #3b82f6;
                    color: #ffffff !important;
                    text-decoration: none;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: 600;
                    margin-top: 16px;
                }
                .footer {
                    font-size: 12px;
                    color: #9ca3af;
                    border-top: 1px solid #e5e5e5;
                    padding-top: 12px;
                    margin-top: 24px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="company">${safeCompany}</div>
                <div class="title">Verify your email</div>

                <p class="text">
                    Hi ${safeName},
                </p>

                <p class="text">
                    Use the following One Time Password \`(OTP)\` to verify your email address. 
                    This code is valid for <strong>${safeExpires}</strong>.
                </p>

                <div class="otp-box">
                    ${otp}
                </div>

                <p class="text">
                    You can also verify your email by clicking the button below:
                </p>

                <a href="${safeLink}" class="btn" target="_blank" rel="noopener noreferrer">
                    Verify Email
                </a>

                <p class="text">
                    If you did not request this, you can safely ignore this email.
                </p>

                <div class="footer">
                    &copy; ${new Date().getFullYear()} ${safeCompany}. All rights reserved.
                </div>
            </div>
        </body>
        </html>
    `;
}

module.exports = verifyEmailTemplate;
