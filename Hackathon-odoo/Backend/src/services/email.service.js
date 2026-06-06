const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.ethereal.email",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || ""
  }
});

exports.sendOTPEmail = async (email, otp) => {
  const fromAddress = process.env.SMTP_FROM || "no-reply@vendorbridge.com";
  const mailOptions = {
    from: fromAddress.includes("<") ? fromAddress : `"vendorBridge Security" <${fromAddress}>`,
    to: email,
    subject: "Your vendorBridge Registration OTP Verification Code",
    text: `Your registration verification code is: ${otp}. This code is valid for 10 minutes.`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #fafafa;">
        <h2 style="color: #059669; margin-bottom: 20px;">vendorBridge Verification</h2>
        <p>Thank you for initiating registration with vendorBridge. Please verify your email address to complete your account registration.</p>
        <div style="background-color: #ecfdf5; border: 1px dashed #34d399; padding: 15px; text-align: center; border-radius: 8px; margin: 25px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #065f46;">${otp}</span>
        </div>
        <p style="font-size: 13px; color: #64748b;">This code will expire in 10 minutes. If you did not request this verification, please ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-top: 25px; margin-bottom: 15px;" />
        <p style="font-size: 11px; color: #94a3b8; text-align: center;">© 2026 vendorBridge. Secure Procurement Platform.</p>
      </div>
    `
  };

  console.log(`\n======================================================`);
  console.log(`[EMAIL DISPATCH] OTP: ${otp} sent to ${email}`);
  console.log(`======================================================\n`);

  if (process.env.SMTP_USER) {
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Successfully dispatched SMTP email to ${email}`);
    } catch (err) {
      console.error("Nodemailer failed to dispatch SMTP email:", err.message);
    }
  } else {
    console.log("SMTP credentials missing in .env. Falling back to console verification logger only.");
  }
};

exports.sendInvoiceEmail = async (email, invoiceNumber, pdfPath) => {
  const mailOptions = {
    from: process.env.SMTP_FROM || `"vendorBridge Security" <no-reply@vendorbridge.com>`,
    to: email,
    subject: `Your vendorBridge Invoice: ${invoiceNumber}`,
    text: `Please find attached your invoice: ${invoiceNumber}.`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #fafafa;">
        <h2 style="color: #059669; margin-bottom: 20px;">Invoice Generated</h2>
        <p>Your invoice <strong>${invoiceNumber}</strong> has been successfully generated for your Purchase Order.</p>
        <p>A copy of the PDF invoice has been attached to this email for your records.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-top: 25px; margin-bottom: 15px;" />
        <p style="font-size: 11px; color: #94a3b8; text-align: center;">© 2026 vendorBridge. Secure Procurement Platform.</p>
      </div>
    `,
    attachments: [
      {
        filename: `${invoiceNumber}.pdf`,
        path: pdfPath
      }
    ]
  };

  if (process.env.SMTP_USER) {
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Successfully dispatched invoice email to ${email}`);
    } catch (err) {
      console.error("Nodemailer failed to dispatch invoice email:", err.message);
    }
  } else {
    console.log("SMTP credentials missing in .env. Email dispatch skipped.");
  }
};
