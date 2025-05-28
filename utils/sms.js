const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

exports.sendOTP = (phone, otp) => {
  return client.messages.create({
    body: `Your Groccy verification code is: ${otp}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phone
  });
};