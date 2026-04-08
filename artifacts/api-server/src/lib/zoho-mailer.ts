const BREVO_API_KEY  = process.env.BREVO_API_KEY;
const FROM_EMAIL     = process.env.BREVO_FROM_EMAIL ?? "noreply@aethex.in";
const FROM_NAME      = process.env.ZOHO_FROM_NAME   ?? "AETHEX Medical";
const ADMIN_EMAIL    = process.env.ADMIN_EMAIL       ?? FROM_EMAIL;
const SITE_URL       = process.env.SITE_URL          ?? "https://aethex.in";

function escapeHtml(s: string | number | null | undefined): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

async function sendBrevoEmail(to: string, subject: string, html: string): Promise<void> {
  if (!BREVO_API_KEY) {
    throw new Error("Email service not configured (BREVO_API_KEY missing)");
  }

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": BREVO_API_KEY,
      "content-type": "application/json",
      "accept": "application/json",
    },
    body: JSON.stringify({
      sender: { name: FROM_NAME, email: FROM_EMAIL },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Brevo API error ${res.status}: ${body}`);
  }
}

function baseHtml(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<style>
  body{margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background:#FAFAF8;color:#1a1a2e;}
  a{color:#00C2A8;text-decoration:none;}
  .wrap{max-width:600px;margin:0 auto;padding:24px;}
  .card{background:#ffffff;border-radius:16px;border:1px solid rgba(0,0,0,0.08);overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);}
  .hdr{background:linear-gradient(135deg,#0A0A0F 0%,#1a1a2e 100%);padding:28px 32px;border-bottom:1px solid rgba(0,194,168,0.2);}
  .logo{font-size:28px;font-weight:800;color:#00C2A8;letter-spacing:-0.5px;}
  .logo span{color:#ffffff;}
  .sub{font-size:12px;color:rgba(255,255,255,0.45);margin-top:4px;letter-spacing:0.04em;}
  .body{padding:32px;}
  .title{font-size:22px;font-weight:700;color:#0A0A0F;margin:0 0 10px;letter-spacing:-0.02em;}
  .otp-box{background:#f0fdf9;border:2px solid #00C2A8;border-radius:14px;padding:28px;text-align:center;margin:24px 0;}
  .otp{font-size:44px;font-weight:900;letter-spacing:14px;color:#00C2A8;font-family:monospace;}
  .otp-note{font-size:13px;color:rgba(0,0,0,0.45);margin-top:10px;}
  .info-box{background:#f8f8f6;border-radius:10px;border:1px solid rgba(0,0,0,0.07);padding:16px;margin:20px 0;}
  .info-row{display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid rgba(0,0,0,0.06);font-size:14px;}
  .info-row:last-child{border-bottom:none;}
  .info-label{color:rgba(0,0,0,0.45);}
  .info-value{color:#0A0A0F;font-weight:500;}
  .ai-box{background:#f0fdf9;border-left:3px solid #00C2A8;border-radius:0 10px 10px 0;padding:16px 20px;margin:20px 0;font-size:15px;color:#1a1a2e;line-height:1.7;}
  .footer{padding:20px 32px;border-top:1px solid rgba(0,0,0,0.07);font-size:12px;color:rgba(0,0,0,0.35);text-align:center;}
  .disclaimer{font-size:11px;color:rgba(0,0,0,0.25);margin-top:10px;}
  .badge{display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:100px;background:rgba(0,194,168,0.1);border:1px solid rgba(0,194,168,0.22);font-size:11px;font-weight:600;color:#009E87;letter-spacing:0.04em;margin-bottom:16px;}
  .dot{width:6px;height:6px;border-radius:50%;background:#00C2A8;display:inline-block;}
</style>
</head>
<body>
<div class="wrap">
  <div class="card">
    <div class="hdr">
      <div class="logo">aethex<span>.</span></div>
      <div class="sub">INDIA'S CLINICAL PLATFORM</div>
    </div>
    ${content}
    <div class="footer">
      &copy; ${new Date().getFullYear()} AETHEX &nbsp;&middot;&nbsp; India's Medical Platform &nbsp;&middot;&nbsp;
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
      <div class="badge"><span class="dot"></span>Secure Login</div>
      <div class="title">Your AETHEX Verification Code</div>
      <p style="color:rgba(0,0,0,0.5);font-size:15px;margin:0 0 4px;">Use the code below to sign in to your AETHEX account.</p>
      <div class="otp-box">
        <div class="otp">${escapeHtml(otp)}</div>
        <div class="otp-note">Valid for <strong style="color:#00C2A8;">5 minutes</strong> &nbsp;&middot;&nbsp; Do not share this code</div>
      </div>
      <p style="color:rgba(0,0,0,0.4);font-size:13px;margin:0;">If you didn't request this code, you can safely ignore this email.</p>
    </div>
  `);

  await sendBrevoEmail(to, "Your AETHEX Verification Code", html);
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
      <div class="badge"><span class="dot"></span>Cadus AI Response</div>
      <div class="title">Hi ${escapeHtml(name)}, here's your response</div>
      <p style="color:rgba(0,0,0,0.5);font-size:14px;margin:0 0 20px;">Thank you for reaching out to AETHEX. Cadus AI has reviewed your query.</p>
      <div class="info-box">
        <div class="info-row"><span class="info-label">Subject</span><span class="info-value">${escapeHtml(subject)}</span></div>
        <div class="info-row"><span class="info-label">Your Query</span><span class="info-value" style="max-width:60%;text-align:right;">${escapeHtml(query)}</span></div>
      </div>
      <p style="color:#0A0A0F;font-weight:600;margin:20px 0 8px;font-size:14px;">Cadus AI Response:</p>
      <div class="ai-box">${escapeHtml(aiResponse).replace(/\n/g, "<br/>")}</div>
      <p style="color:rgba(0,0,0,0.4);font-size:13px;">Our team will follow up if your query requires further assistance.</p>
    </div>
  `);

  await sendBrevoEmail(to, `Re: ${subject} — Cadus AI Response`, html);
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
      <div class="badge"><span class="dot"></span>New Contact Query</div>
      <div class="title">Contact Form Submission</div>
      <p style="color:rgba(0,0,0,0.5);font-size:14px;margin:0 0 16px;">A user has submitted a query via the AETHEX contact form.</p>
      <div class="info-box">
        <div class="info-row"><span class="info-label">Name</span><span class="info-value">${escapeHtml(name)}</span></div>
        <div class="info-row"><span class="info-label">Email</span><span class="info-value">${escapeHtml(email)}</span></div>
        <div class="info-row"><span class="info-label">Subject</span><span class="info-value">${escapeHtml(subject)}</span></div>
        <div class="info-row"><span class="info-label">Timestamp</span><span class="info-value">${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST</span></div>
      </div>
      <p style="color:#0A0A0F;font-weight:600;margin:20px 0 8px;font-size:14px;">User Message:</p>
      <div class="ai-box" style="border-color:rgba(0,0,0,0.15);background:#f8f8f6;">${escapeHtml(query).replace(/\n/g, "<br/>")}</div>
      <p style="color:#0A0A0F;font-weight:600;margin:20px 0 8px;font-size:14px;">Cadus AI Response Sent to User:</p>
      <div class="ai-box">${escapeHtml(aiResponse).replace(/\n/g, "<br/>")}</div>
    </div>
  `);

  await sendBrevoEmail(ADMIN_EMAIL, `[AETHEX Contact] ${subject} — from ${name}`, html);
}
