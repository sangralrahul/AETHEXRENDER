import nodemailer from "nodemailer";

const ZOHO_USER = process.env.ZOHO_USER;
const ZOHO_PASS = process.env.ZOHO_PASS;
const FROM_NAME = process.env.ZOHO_FROM_NAME ?? "AETHEX Medical";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? ZOHO_USER;
const SITE_URL = process.env.SITE_URL ?? "https://aethex.in";

function getTransporter() {
  if (!ZOHO_USER || !ZOHO_PASS) {
    throw new Error("Zoho SMTP credentials not configured (ZOHO_USER / ZOHO_PASS)");
  }
  return nodemailer.createTransport({
    host: "smtp.zoho.in",
    port: 465,
    secure: true,
    auth: { user: ZOHO_USER, pass: ZOHO_PASS },
  });
}

function baseHtml(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<style>
  body{margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background:#0D1117;color:#C9D1D9;}
  a{color:#22D3EE;text-decoration:none;}
  .wrap{max-width:600px;margin:0 auto;padding:20px;}
  .card{background:#161B22;border-radius:12px;border:1px solid #21262D;overflow:hidden;}
  .hdr{background:linear-gradient(135deg,#0D2137 0%,#0D1117 100%);padding:28px 32px;border-bottom:1px solid #21262D;}
  .logo{font-size:26px;font-weight:800;color:#22D3EE;letter-spacing:-0.5px;}
  .logo span{color:#E6EDF3;}
  .sub{font-size:12px;color:#8B949E;margin-top:4px;}
  .body{padding:28px 32px;}
  .title{font-size:22px;font-weight:700;color:#E6EDF3;margin:0 0 8px;}
  .otp-box{background:#0D1117;border:2px solid #22D3EE;border-radius:12px;padding:24px;text-align:center;margin:24px 0;}
  .otp{font-size:42px;font-weight:900;letter-spacing:12px;color:#22D3EE;font-family:monospace;}
  .otp-note{font-size:13px;color:#8B949E;margin-top:8px;}
  .info-box{background:#0D1117;border-radius:8px;border:1px solid #21262D;padding:16px;margin:20px 0;}
  .info-row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #21262D;font-size:14px;}
  .info-row:last-child{border-bottom:none;}
  .info-label{color:#8B949E;}
  .info-value{color:#E6EDF3;font-weight:500;}
  .ai-box{background:#0D2137;border-left:3px solid #22D3EE;border-radius:0 8px 8px 0;padding:16px 20px;margin:20px 0;font-size:15px;color:#C9D1D9;line-height:1.7;}
  .footer{padding:20px 32px;border-top:1px solid #21262D;font-size:12px;color:#8B949E;text-align:center;}
  .disclaimer{font-size:11px;color:#6E7681;margin-top:12px;}
</style>
</head>
<body>
<div class="wrap">
  <div class="card">
    <div class="hdr">
      <div class="logo">aethex<span>.</span></div>
      <div class="sub">Medical Store &amp; Cadus AI Platform</div>
    </div>
    ${content}
    <div class="footer">
      &copy; ${new Date().getFullYear()} AETHEX &middot; India's Medical Store &middot;
      <a href="${SITE_URL}">${SITE_URL}</a>
      <div class="disclaimer">Cadus AI responses are for informational purposes only. Always consult a licensed medical professional for clinical decisions.</div>
    </div>
  </div>
</div>
</body>
</html>`;
}

export async function sendOtpEmail(to: string, otp: string): Promise<void> {
  const html = baseHtml(`
    <div class="body">
      <div class="title">Your AETHEX OTP Code</div>
      <p style="color:#8B949E;font-size:15px;margin:0 0 8px;">Use the code below to log in to your AETHEX account.</p>
      <div class="otp-box">
        <div class="otp">${otp}</div>
        <div class="otp-note">Valid for <strong>5 minutes</strong> &middot; Do not share this code</div>
      </div>
      <p style="color:#8B949E;font-size:13px;">If you didn't request this code, you can safely ignore this email.</p>
    </div>
  `);

  await getTransporter().sendMail({
    from: `"${FROM_NAME}" <${ZOHO_USER}>`,
    to,
    subject: "Your AETHEX OTP Code",
    html,
  });
}

export async function sendContactUserEmail(
  to: string,
  name: string,
  subject: string,
  query: string,
  aiResponse: string
): Promise<void> {
  const html = baseHtml(`
    <div class="body">
      <div class="title">Hi ${name}, Cadus AI has responded</div>
      <p style="color:#8B949E;font-size:14px;margin:0 0 20px;">Thank you for reaching out to AETHEX. Here's Cadus AI's response to your query.</p>
      <div class="info-box">
        <div class="info-row"><span class="info-label">Subject</span><span class="info-value">${subject}</span></div>
        <div class="info-row"><span class="info-label">Your Query</span><span class="info-value" style="max-width:60%;text-align:right;">${query}</span></div>
      </div>
      <p style="color:#E6EDF3;font-weight:600;margin:20px 0 8px;">Cadus AI Response:</p>
      <div class="ai-box">${aiResponse.replace(/\n/g, "<br/>")}</div>
      <p style="color:#8B949E;font-size:13px;">Our support team will follow up if your query requires human assistance.</p>
    </div>
  `);

  await getTransporter().sendMail({
    from: `"${FROM_NAME}" <${ZOHO_USER}>`,
    to,
    subject: `Re: ${subject} — Cadus AI Response`,
    html,
  });
}

export async function sendContactAdminEmail(
  name: string,
  email: string,
  subject: string,
  query: string,
  aiResponse: string
): Promise<void> {
  if (!ADMIN_EMAIL) return;

  const html = baseHtml(`
    <div class="body">
      <div class="title">New Contact Query</div>
      <p style="color:#8B949E;font-size:14px;margin:0 0 16px;">A user has submitted a query via the AETHEX contact form.</p>
      <div class="info-box">
        <div class="info-row"><span class="info-label">Name</span><span class="info-value">${name}</span></div>
        <div class="info-row"><span class="info-label">Email</span><span class="info-value">${email}</span></div>
        <div class="info-row"><span class="info-label">Subject</span><span class="info-value">${subject}</span></div>
        <div class="info-row"><span class="info-label">Timestamp</span><span class="info-value">${new Date().toISOString()}</span></div>
      </div>
      <p style="color:#E6EDF3;font-weight:600;margin:20px 0 8px;">User Message:</p>
      <div class="ai-box" style="border-color:#8B949E;">${query.replace(/\n/g, "<br/>")}</div>
      <p style="color:#E6EDF3;font-weight:600;margin:20px 0 8px;">Cadus AI Response Sent to User:</p>
      <div class="ai-box">${aiResponse.replace(/\n/g, "<br/>")}</div>
    </div>
  `);

  await getTransporter().sendMail({
    from: `"${FROM_NAME}" <${ZOHO_USER}>`,
    to: ADMIN_EMAIL,
    subject: `[AETHEX Contact] ${subject} — from ${name}`,
    html,
  });
}
