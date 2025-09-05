import nodemailer from "nodemailer";

let transporter = null;

export async function getMailer() {
  // Console-only mode for dev
  if (process.env.MAIL_MODE === "console") return null;

  if (transporter) return transporter;
  try {
    const testAcc = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: testAcc.smtp.host,
      port: testAcc.smtp.port,
      secure: testAcc.smtp.secure,
      auth: { user: testAcc.user, pass: testAcc.pass },
      // 👇 allow self-signed in dev networks (optional)
      tls: { rejectUnauthorized: false },
    });
    console.log("📬 Ethereal SMTP ready as:", testAcc.user);
  } catch (err) {
    console.warn("Mailer disabled (using console fallback):", err?.message || err);
    transporter = null; // fallback to console logging
  }
  return transporter;
}

export async function sendMail({ to, subject, html }) {
  const tx = await getMailer();
  if (!tx) {
    // Console fallback
    console.log("---- EMAIL (console) ----");
    console.log("To:", to);
    console.log("Subject:", subject);
    console.log("HTML:\n", html);
    console.log("-------------------------");
    return { messageId: "console-fallback", preview: null };
  }
  const info = await tx.sendMail({
    from: '"CookieShop" <no-reply@cookies.dev>',
    to, subject, html,
  });
  const preview = nodemailer.getTestMessageUrl(info);
  if (preview) console.log("🔗 Email preview:", preview);
  return { messageId: info.messageId, preview };
}
