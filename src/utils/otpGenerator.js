exports.otpGenerator = ()=>{
    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiry = new Date(Date.now() + 2 * 60 * 1000); // OTP valid for 2 minutes
    return {otp, expiry}
}
