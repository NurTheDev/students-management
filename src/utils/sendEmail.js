const nodeMailer = require('nodemailer');

const transporter = nodeMailer.createTransport({
    service: 'gmail',
    secure: process.env.NODE_ENV === 'production',
    auth:{
        user: process.env.EMAIL_ID,
        pass: process.env.APP_PASSWORD.replace(/_/g,' ')
    }
})
exports.sendEmail = async (email, template, subject) => {
    const info = await transporter.sendMail({
        from: 'Student Management System',
        to: email,
        subject: subject,
        html: template
    })
    console.log("Message sent: %s", info.messageId);
}