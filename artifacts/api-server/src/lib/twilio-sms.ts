import twilio from "twilio";

function getTwilioClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    throw new Error("Twilio credentials not configured. Please connect Twilio in Replit Integrations.");
  }

  return twilio(accountSid, authToken);
}

export async function sendPhoneOtp(toPhone: string, otp: string): Promise<void> {
  const from = process.env.TWILIO_PHONE_NUMBER;
  if (!from) {
    throw new Error("TWILIO_PHONE_NUMBER environment variable is not set.");
  }

  const client = getTwilioClient();

  await client.messages.create({
    body: `Your AETHEX verification code is: ${otp}\n\nValid for 5 minutes. Do not share this code with anyone.\n\n- AETHEX Medical`,
    from,
    to: toPhone,
  });
}
