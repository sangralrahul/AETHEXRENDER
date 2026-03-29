import { db, emailLogsTable } from "@workspace/db";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL ?? "orders@aethex.in";
const SUPPORT_EMAIL = "support@aethex.in";
const SITE_URL = process.env.SITE_URL ?? "https://aethex.in";

function baseEmailHtml(content: string, previewText: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${previewText}</title>
<style>
  body{margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background:#0D1117;color:#C9D1D9;}
  a{color:#22D3EE;text-decoration:none;}
  .container{max-width:600px;margin:0 auto;padding:20px;}
  .card{background:#161B22;border-radius:12px;border:1px solid #21262D;overflow:hidden;}
  .header{background:linear-gradient(135deg,#0D2137 0%,#0D1117 100%);padding:28px 32px;border-bottom:1px solid #21262D;}
  .logo{font-size:26px;font-weight:800;color:#22D3EE;letter-spacing:-0.5px;}
  .logo span{color:#E6EDF3;}
  .body{padding:28px 32px;}
  .title{font-size:22px;font-weight:700;color:#E6EDF3;margin:0 0 8px;}
  .subtitle{font-size:15px;color:#8B949E;margin:0 0 24px;}
  .info-box{background:#0D1117;border-radius:8px;border:1px solid #21262D;padding:16px;margin:20px 0;}
  .info-row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #21262D;font-size:14px;}
  .info-row:last-child{border-bottom:none;}
  .info-label{color:#8B949E;}
  .info-value{color:#E6EDF3;font-weight:500;}
  .status-badge{display:inline-block;padding:4px 12px;border-radius:999px;font-size:12px;font-weight:600;background:#0D2137;color:#22D3EE;border:1px solid #22D3EE40;}
  .cta-btn{display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#0891B2,#0E7490);color:#fff!important;border-radius:8px;font-weight:700;font-size:15px;margin:20px 0;}
  .item-row{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid #21262D;}
  .item-row:last-child{border-bottom:none;}
  .item-name{font-size:14px;color:#E6EDF3;font-weight:500;}
  .item-qty{font-size:12px;color:#8B949E;}
  .item-price{font-size:14px;color:#22D3EE;font-weight:600;margin-left:auto;}
  .footer{padding:20px 32px;border-top:1px solid #21262D;font-size:12px;color:#8B949E;text-align:center;}
  .footer a{color:#8B949E;}
  .divider{height:1px;background:#21262D;margin:20px 0;}
</style>
</head>
<body>
<div class="container">
  <div class="card">
    <div class="header">
      <div class="logo">aethex<span>.</span></div>
      <div style="font-size:12px;color:#8B949E;margin-top:4px;">Medical Store & SYNAPSE AI Platform</div>
    </div>
    ${content}
    <div class="footer">
      <p>© ${new Date().getFullYear()} Aethex Medical. All rights reserved.</p>
      <p><a href="${SITE_URL}">aethex.in</a> · <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a> · <a href="${SITE_URL}/unsubscribe">Unsubscribe</a></p>
    </div>
  </div>
</div>
</body>
</html>`;
}

async function sendEmail(to: string, subject: string, html: string, orderId?: string, type = "general"): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.log(`[Email] No RESEND_API_KEY — would send "${subject}" to ${to}`);
    await db.insert(emailLogsTable).values({ toEmail: to, type, orderId, status: "skipped", error: "No API key" });
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? "Send failed");
    await db.insert(emailLogsTable).values({ toEmail: to, type, orderId, status: "sent" });
    return true;
  } catch (err: any) {
    console.error("[Email] Send error:", err.message);
    await db.insert(emailLogsTable).values({ toEmail: to, type, orderId, status: "failed", error: err.message });
    return false;
  }
}

function formatCurrency(amount: string | number): string {
  return `₹${Number(amount).toFixed(2)}`;
}

function orderItemsHtml(items: Array<{ name: string; quantity: number; price: string; }>): string {
  return items.map(i => `
    <div class="item-row">
      <div>
        <div class="item-name">${i.name}</div>
        <div class="item-qty">Qty: ${i.quantity}</div>
      </div>
      <div class="item-price">${formatCurrency(Number(i.price) * i.quantity)}</div>
    </div>`).join("");
}

export async function sendOrderConfirmationEmail(order: {
  id: string; customerName: string; customerEmail: string;
  items: Array<{ name: string; quantity: number; price: string; }>;
  total: string; subtotal: string; tax: string; deliveryFee: string;
  deliveryAddress: { line1: string; line2?: string; city: string; state: string; pincode: string; };
  estimatedDelivery?: Date | null;
}): Promise<boolean> {
  const estDate = order.estimatedDelivery
    ? new Date(order.estimatedDelivery).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : "3-5 business days";

  const html = baseEmailHtml(`
    <div class="body">
      <div class="title">Order Confirmed! 🎉</div>
      <div class="subtitle">Hi ${order.customerName}, your Aethex order is confirmed.</div>
      <div class="status-badge">Order #${order.id}</div>
      <div class="info-box">
        ${orderItemsHtml(order.items)}
      </div>
      <div class="info-box">
        <div class="info-row"><span class="info-label">Subtotal</span><span class="info-value">${formatCurrency(order.subtotal)}</span></div>
        <div class="info-row"><span class="info-label">Tax</span><span class="info-value">${formatCurrency(order.tax)}</span></div>
        <div class="info-row"><span class="info-label">Delivery</span><span class="info-value">${formatCurrency(order.deliveryFee)}</span></div>
        <div class="info-row"><span class="info-label">Total</span><span class="info-value" style="color:#22D3EE;font-size:16px;">${formatCurrency(order.total)}</span></div>
      </div>
      <div class="info-box">
        <div class="info-row"><span class="info-label">Delivery Address</span><span class="info-value">${order.deliveryAddress.line1}${order.deliveryAddress.line2 ? ", " + order.deliveryAddress.line2 : ""}, ${order.deliveryAddress.city}, ${order.deliveryAddress.state} - ${order.deliveryAddress.pincode}</span></div>
        <div class="info-row"><span class="info-label">Estimated Delivery</span><span class="info-value">${estDate}</span></div>
      </div>
      <a href="${SITE_URL}/orders/track?orderId=${order.id}" class="cta-btn">Track My Order</a>
    </div>`, `Your Aethex order #${order.id} is confirmed!`);

  return sendEmail(order.customerEmail, `Your Aethex order #${order.id} is confirmed! 🎉`, html, order.id, "order_confirmed");
}

export async function sendPaymentFailedEmail(order: { id: string; customerName: string; customerEmail: string; total: string; }): Promise<boolean> {
  const html = baseEmailHtml(`
    <div class="body">
      <div class="title">Payment Failed ⚠️</div>
      <div class="subtitle">Hi ${order.customerName}, your payment for order #${order.id} could not be processed.</div>
      <div class="info-box">
        <div class="info-row"><span class="info-label">Order ID</span><span class="info-value">#${order.id}</span></div>
        <div class="info-row"><span class="info-label">Amount</span><span class="info-value">${formatCurrency(order.total)}</span></div>
      </div>
      <p style="color:#8B949E;font-size:14px;">Please retry your payment. If the issue persists, contact our support team.</p>
      <a href="${SITE_URL}/orders/track?orderId=${order.id}" class="cta-btn">Retry Payment</a>
    </div>`, `Payment failed for order #${order.id}`);

  return sendEmail(order.customerEmail, `Payment failed for your Aethex order #${order.id}`, html, order.id, "payment_failed");
}

export async function sendOrderShippedEmail(order: {
  id: string; customerName: string; customerEmail: string;
  courierName: string; trackingNumber: string; courierUrl?: string | null; estimatedDelivery?: Date | null;
}): Promise<boolean> {
  const estDate = order.estimatedDelivery
    ? new Date(order.estimatedDelivery).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })
    : "soon";

  const html = baseEmailHtml(`
    <div class="body">
      <div class="title">Your Order Has Shipped! 🚚</div>
      <div class="subtitle">Hi ${order.customerName}, order #${order.id} is on its way.</div>
      <div class="info-box">
        <div class="info-row"><span class="info-label">Courier</span><span class="info-value">${order.courierName}</span></div>
        <div class="info-row"><span class="info-label">Tracking Number</span><span class="info-value">${order.trackingNumber}</span></div>
        <div class="info-row"><span class="info-label">Expected Delivery</span><span class="info-value">${estDate}</span></div>
      </div>
      ${order.courierUrl ? `<a href="${order.courierUrl}" class="cta-btn">Track on Courier Site</a>` : ""}
      <a href="${SITE_URL}/orders/track?orderId=${order.id}" class="cta-btn" style="margin-left:12px;">Track on Aethex</a>
    </div>`, `Order #${order.id} has been shipped!`);

  return sendEmail(order.customerEmail, `Your Aethex order #${order.id} has shipped! 🚚`, html, order.id, "order_shipped");
}

export async function sendOutForDeliveryEmail(order: { id: string; customerName: string; customerEmail: string; }): Promise<boolean> {
  const html = baseEmailHtml(`
    <div class="body">
      <div class="title">Out for Delivery Today! 📦</div>
      <div class="subtitle">Hi ${order.customerName}, your Aethex order #${order.id} is out for delivery today.</div>
      <p style="color:#8B949E;font-size:14px;">Please ensure someone is available at the delivery address to receive the package.</p>
      <a href="${SITE_URL}/orders/track?orderId=${order.id}" class="cta-btn">Track Your Order</a>
    </div>`, `Order #${order.id} is out for delivery today!`);

  return sendEmail(order.customerEmail, `Your Aethex order #${order.id} is out for delivery today! 📦`, html, order.id, "out_for_delivery");
}

export async function sendOrderDeliveredEmail(order: { id: string; customerName: string; customerEmail: string; }): Promise<boolean> {
  const html = baseEmailHtml(`
    <div class="body">
      <div class="title">Order Delivered! ✅</div>
      <div class="subtitle">Hi ${order.customerName}, your Aethex order #${order.id} has been delivered.</div>
      <p style="color:#8B949E;font-size:14px;">Thank you for shopping with Aethex! We hope you love your purchase.</p>
      <div style="text-align:center;margin:24px 0;">
        <a href="${SITE_URL}/orders/track?orderId=${order.id}" class="cta-btn" style="margin-right:12px;">Rate Your Purchase</a>
        <a href="${SITE_URL}/products" class="cta-btn">Shop Again</a>
      </div>
    </div>`, `Order #${order.id} delivered!`);

  return sendEmail(order.customerEmail, `Your Aethex order #${order.id} has been delivered! ✅`, html, order.id, "order_delivered");
}

export async function sendOrderCancelledEmail(order: {
  id: string; customerName: string; customerEmail: string;
  cancellationReason?: string | null; refundStatus?: string | null;
}): Promise<boolean> {
  const html = baseEmailHtml(`
    <div class="body">
      <div class="title">Order Cancelled</div>
      <div class="subtitle">Hi ${order.customerName}, your Aethex order #${order.id} has been cancelled.</div>
      ${order.cancellationReason ? `<div class="info-box"><div class="info-row"><span class="info-label">Reason</span><span class="info-value">${order.cancellationReason}</span></div></div>` : ""}
      ${order.refundStatus ? `<div class="info-box"><div class="info-row"><span class="info-label">Refund Status</span><span class="info-value">${order.refundStatus}</span></div><div class="info-row"><span class="info-label">Refund Timeline</span><span class="info-value">5-7 business days</span></div></div>` : ""}
      <a href="${SITE_URL}/products" class="cta-btn">Continue Shopping</a>
    </div>`, `Order #${order.id} has been cancelled`);

  return sendEmail(order.customerEmail, `Your Aethex order #${order.id} has been cancelled`, html, order.id, "order_cancelled");
}

export async function sendProActivatedEmail(to: string, name: string, validUntil?: Date): Promise<boolean> {
  const validity = validUntil
    ? new Date(validUntil).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : "lifetime";

  const html = baseEmailHtml(`
    <div class="body">
      <div class="title">Welcome to SYNAPSE Pro! ✨</div>
      <div class="subtitle">Hi ${name}, your SYNAPSE Pro plan is now active.</div>
      <div class="info-box">
        <div class="info-row"><span class="info-label">Plan</span><span class="info-value">SYNAPSE Pro</span></div>
        <div class="info-row"><span class="info-label">Valid Until</span><span class="info-value">${validity}</span></div>
      </div>
      <p style="color:#8B949E;font-size:14px;">You now have access to all Pro features including Nova 4.6, Scan Analysis, unlimited queries, and more.</p>
      <a href="${SITE_URL}/ai-assistant" class="cta-btn">Start Using SYNAPSE Pro</a>
    </div>`, "Welcome to SYNAPSE Pro!");

  return sendEmail(to, "Welcome to SYNAPSE Pro! Your plan is now active ✨", html, undefined, "pro_activated");
}

export async function sendProExpiringEmail(to: string, name: string, daysLeft: number, validUntil: Date): Promise<boolean> {
  const html = baseEmailHtml(`
    <div class="body">
      <div class="title">SYNAPSE Pro Expiring Soon ⏰</div>
      <div class="subtitle">Hi ${name}, your SYNAPSE Pro plan expires in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}.</div>
      <div class="info-box">
        <div class="info-row"><span class="info-label">Expiry Date</span><span class="info-value">${new Date(validUntil).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span></div>
      </div>
      <p style="color:#8B949E;font-size:14px;">Renew now to continue uninterrupted access to all SYNAPSE Pro features.</p>
      <a href="${SITE_URL}/ai-assistant" class="cta-btn">Renew SYNAPSE Pro</a>
    </div>`, `SYNAPSE Pro expires in ${daysLeft} days`);

  return sendEmail(to, `Your SYNAPSE Pro expires in ${daysLeft} days — Renew now`, html, undefined, "pro_expiring");
}
