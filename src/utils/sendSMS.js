const axios = require('axios');
const {CustomError} = require('../helpers/customError');
const sendSMS = async (number, message)=>{
    console.log(message, number)
try {
    await axios.post(process.env.SMS_URL, {
        "api_key" : process.env.SMS_API_KEY,
        "senderid" : process.env.SMS_SENDER_ID,
        "number" : Array.isArray(number)? number.join(",") : number,
        "message" : message
    })
} catch (error) {
    console.error(error);
    throw new CustomError('Failed to send SMS', 500);
}
}
module.exports = sendSMS