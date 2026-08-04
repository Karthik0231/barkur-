import nodemailer from "nodemailer"
import { TEMPLE_NAME, TEMPLE_EMAIL } from "@/lib/constants"

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

function escapeHtmlAttr(str: string): string {
  return escapeHtml(str)
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT ?? "587", 10),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

const defaultFrom = `"${TEMPLE_NAME}" <${process.env.SMTP_FROM ?? TEMPLE_EMAIL}>`

interface SendEmailParams {
  to: string
  subject: string
  html: string
  from?: string
}

interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
}

export async function sendEmail({ to, subject, html, from }: SendEmailParams): Promise<EmailResult> {
  try {
    const info = await transporter.sendMail({
      from: from ?? defaultFrom,
      to,
      subject,
      html,
    })
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Email send failed:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function sendBookingConfirmation(
  booking: { id: string; type: string; date: string; amount?: number },
  user: { email: string; name: string }
): Promise<EmailResult> {
  const html = `
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;">
      <div style="background:#7B1A2C;padding:20px;text-align:center;border-radius:8px 8px 0 0;">
        <h1 style="color:#D4A843;margin:0;">${TEMPLE_NAME}</h1>
      </div>
      <div style="background:#FDF8F0;padding:30px;border:1px solid #C4A882;">
        <h2 style="color:#7B1A2C;">Booking Confirmed!</h2>
        <p>Dear ${escapeHtml(user.name)},</p>
        <p>Your booking has been confirmed successfully.</p>
        <table style="width:100%;border-collapse:collapse;margin:20px 0;">
          <tr><td style="padding:8px;border:1px solid #C4A882;font-weight:bold;">Booking ID</td><td style="padding:8px;border:1px solid #C4A882;">${escapeHtml(booking.id)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #C4A882;font-weight:bold;">Type</td><td style="padding:8px;border:1px solid #C4A882;">${escapeHtml(booking.type)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #C4A882;font-weight:bold;">Date</td><td style="padding:8px;border:1px solid #C4A882;">${escapeHtml(booking.date)}</td></tr>
          ${booking.amount ? `<tr><td style="padding:8px;border:1px solid #C4A882;font-weight:bold;">Amount</td><td style="padding:8px;border:1px solid #C4A882;">₹${escapeHtml(String(booking.amount))}</td></tr>` : ""}
        </table>
        <p>Please contact the temple for any changes or cancellations.</p>
        <p>With blessings,<br/>${TEMPLE_NAME}</p>
      </div>
    </div>
  `
  return sendEmail({
    to: user.email,
    subject: `Booking Confirmed - ${booking.id}`,
    html,
  })
}

export async function sendDonationReceipt(
  donation: { id: string; amount: number; date: string; category: string },
  donor: { email: string; name: string }
): Promise<EmailResult> {
  const html = `
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;">
      <div style="background:#7B1A2C;padding:20px;text-align:center;border-radius:8px 8px 0 0;">
        <h1 style="color:#D4A843;margin:0;">${TEMPLE_NAME}</h1>
      </div>
      <div style="background:#FDF8F0;padding:30px;border:1px solid #C4A882;">
        <h2 style="color:#7B1A2C;">Donation Receipt</h2>
        <p>Dear ${escapeHtml(donor.name)},</p>
        <p>Thank you for your generous donation!</p>
        <table style="width:100%;border-collapse:collapse;margin:20px 0;">
          <tr><td style="padding:8px;border:1px solid #C4A882;font-weight:bold;">Receipt No</td><td style="padding:8px;border:1px solid #C4A882;">${escapeHtml(donation.id)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #C4A882;font-weight:bold;">Amount</td><td style="padding:8px;border:1px solid #C4A882;">₹${escapeHtml(String(donation.amount))}</td></tr>
          <tr><td style="padding:8px;border:1px solid #C4A882;font-weight:bold;">Category</td><td style="padding:8px;border:1px solid #C4A882;">${escapeHtml(donation.category)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #C4A882;font-weight:bold;">Date</td><td style="padding:8px;border:1px solid #C4A882;">${escapeHtml(donation.date)}</td></tr>
        </table>
        <p>This receipt is valid for tax exemption under applicable laws.</p>
        <p>With gratitude,<br/>${TEMPLE_NAME}</p>
      </div>
    </div>
  `
  return sendEmail({
    to: donor.email,
    subject: `Donation Receipt - ${donation.id}`,
    html,
  })
}

export async function sendCertificate(
  certificate: { id: string; type: string; url?: string },
  user: { email: string; name: string }
): Promise<EmailResult> {
  const html = `
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;">
      <div style="background:#7B1A2C;padding:20px;text-align:center;border-radius:8px 8px 0 0;">
        <h1 style="color:#D4A843;margin:0;">${TEMPLE_NAME}</h1>
      </div>
      <div style="background:#FDF8F0;padding:30px;border:1px solid #C4A882;">
        <h2 style="color:#7B1A2C;">Your Certificate is Ready</h2>
        <p>Dear ${escapeHtml(user.name)},</p>
        <p>Your ${escapeHtml(certificate.type)} certificate has been generated.</p>
        <p>Certificate ID: ${escapeHtml(certificate.id)}</p>
        ${certificate.url ? `<p><a href="${escapeHtmlAttr(certificate.url)}" style="display:inline-block;background:#7B1A2C;color:#D4A843;padding:10px 20px;text-decoration:none;border-radius:5px;">Download Certificate</a></p>` : ""}
        <p>With blessings,<br/>${TEMPLE_NAME}</p>
      </div>
    </div>
  `
  return sendEmail({
    to: user.email,
    subject: `Your ${escapeHtml(certificate.type)} Certificate from ${TEMPLE_NAME}`,
    html,
  })
}

export async function sendOTP(email: string, otp: string): Promise<EmailResult> {
  const html = `
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;">
      <div style="background:#7B1A2C;padding:20px;text-align:center;border-radius:8px 8px 0 0;">
        <h1 style="color:#D4A843;margin:0;">${TEMPLE_NAME}</h1>
      </div>
      <div style="background:#FDF8F0;padding:30px;border:1px solid #C4A882;text-align:center;">
        <h2 style="color:#7B1A2C;">Your OTP</h2>
        <div style="font-size:36px;letter-spacing:8px;font-weight:bold;color:#7B1A2C;margin:20px 0;">${escapeHtml(otp)}</div>
        <p>This OTP is valid for 10 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    </div>
  `
  return sendEmail({
    to: email,
    subject: `Your OTP for ${TEMPLE_NAME}`,
    html,
  })
}

export async function sendPasswordReset(
  email: string,
  token: string
): Promise<EmailResult> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  if (!baseUrl) {
    return { success: false, error: "NEXT_PUBLIC_APP_URL is not configured" }
  }
  const resetUrl = `${baseUrl.replace(/\/$/, "")}/reset-password?token=${encodeURIComponent(token)}`
  const html = `
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;">
      <div style="background:#7B1A2C;padding:20px;text-align:center;border-radius:8px 8px 0 0;">
        <h1 style="color:#D4A843;margin:0;">${TEMPLE_NAME}</h1>
      </div>
      <div style="background:#FDF8F0;padding:30px;border:1px solid #C4A882;text-align:center;">
        <h2 style="color:#7B1A2C;">Password Reset</h2>
        <p>Click the button below to reset your password.</p>
        <a href="${escapeHtmlAttr(resetUrl)}" style="display:inline-block;background:#7B1A2C;color:#D4A843;padding:12px 30px;text-decoration:none;border-radius:5px;font-size:16px;">Reset Password</a>
        <p style="margin-top:20px;color:#666;">This link is valid for 1 hour.</p>
        <p style="color:#666;">If you did not request a password reset, please ignore this email.</p>
      </div>
    </div>
  `
  return sendEmail({
    to: email,
    subject: `Reset Your Password - ${TEMPLE_NAME}`,
    html,
  })
}

export async function sendAdminNotification(
  type: string,
  data: Record<string, unknown>
): Promise<EmailResult> {
  const html = `
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;">
      <div style="background:#7B1A2C;padding:20px;text-align:center;border-radius:8px 8px 0 0;">
        <h1 style="color:#D4A843;margin:0;">${TEMPLE_NAME} - Admin Notification</h1>
      </div>
      <div style="background:#FDF8F0;padding:30px;border:1px solid #C4A882;">
        <h2 style="color:#7B1A2C;">${escapeHtml(type)}</h2>
        <pre style="background:#f5f5f5;padding:15px;border-radius:5px;overflow-x:auto;">${escapeHtml(JSON.stringify(data, null, 2))}</pre>
      </div>
    </div>
  `
  return sendEmail({
    to: process.env.ADMIN_EMAIL ?? TEMPLE_EMAIL,
    subject: `[Admin] ${escapeHtml(type)} - ${TEMPLE_NAME}`,
    html,
  })
}
