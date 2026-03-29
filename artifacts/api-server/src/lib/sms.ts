import { db, smsLogsTable } from "@workspace/db";

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_FROM = process.env.TWILIO_PHONE_NUMBER;

async function sendSms(to: string, message: string, orderId?: string, type = "general"): Promise<boolean> {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM) {
    console.log(`[SMS] No Twilio credentials — would send to ${to}: "${message}"`);
    await db.insert(smsLogsTable).values({ toPhone: to, type, orderId, status: "skipped", error: "No credentials" });
    return false;
  }

  const phone = to.startsWith("+") ? to : `+91${to}`;

  try {
    const credentials = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64");
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ From: TWILIO_FROM, To: phone, Body: message }).toString(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? "SMS send failed");
    await db.insert(smsLogsTable).values({ toPhone: to, type, orderId, status: "sent" });
    return true;
  } catch (err: any) {
    console.error("[SMS] Send error:", err.message);
    await db.insert(smsLogsTable).values({ toPhone: to, type, orderId, status: "failed", error: err.message });
    return false;
  }
}

export async function sendOrderConfirmedSms(phone: string, orderId: string, estimatedDelivery?: Date | null): Promise<boolean> {
  const estDate = estimatedDelivery
    ? new Date(estimatedDelivery).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
    : "3-5 days";
  return sendSms(phone, `Aethex: Order #${orderId} confirmed. Est. delivery: ${estDate}. Track: aethex.in/orders/track`, orderId, "order_confirmed");
}

export async function sendOrderShippedSms(phone: string, orderId: string, courierName: string, trackingNumber: string): Promise<boolean> {
  return sendSms(phone, `Aethex: Order #${orderId} shipped via ${courierName}. Tracking: ${trackingNumber}. Track: aethex.in/orders/track`, orderId, "order_shipped");
}

export async function sendOutForDeliverySms(phone: string, orderId: string): Promise<boolean> {
  return sendSms(phone, `Aethex: Your order #${orderId} is out for delivery today! Please be available at the delivery address.`, orderId, "out_for_delivery");
}

export async function sendOrderDeliveredSms(phone: string, orderId: string): Promise<boolean> {
  return sendSms(phone, `Aethex: Order #${orderId} delivered! Rate your experience: aethex.in/orders`, orderId, "order_delivered");
}

export async function sendProActivatedSms(phone: string): Promise<boolean> {
  return sendSms(phone, `Aethex: SYNAPSE Pro activated! Enjoy unlimited AI queries and all Pro features. Visit aethex.in/ai-assistant`, undefined, "pro_activated");
}
