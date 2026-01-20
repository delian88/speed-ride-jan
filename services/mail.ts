
interface MailOptions {
  email: string;
  name: string;
  role: 'RIDER' | 'DRIVER';
}

/**
 * SPEEDRIDE 2026 | Neural Mail Service
 * Uses SmtpJS for real delivery and a Virtual Interceptor for instant UX.
 */

const SMTP_CONFIG = {
  Host: "smtp.gmail.com",
  Username: "walpconsult@gmail.com",
  Password: "mjbhowjkzmfxqrgd", // Provided Gmail App Password
  From: "walpconsult@gmail.com"
};

const triggerVirtualInterceptor = (subject: string, body: string, otp?: string) => {
  const event = new CustomEvent('speedride_mail_intercept', { 
    detail: { subject, body, otp, timestamp: new Date().toLocaleTimeString() } 
  });
  window.dispatchEvent(event);
  console.log(`%c SpeedRide Interceptor | ${subject}`, 'background: #2563eb; color: #fff; padding: 2px 5px; border-radius: 4px;');
};

export const sendWelcomeEmail = async ({ email, name, role }: MailOptions) => {
  const isDriver = role === 'DRIVER';
  const subject = isDriver 
    ? "Welcome to the Fleet, Partner! | SpeedRide 2026" 
    : "Your Journey Begins Now | SpeedRide 2026";

  const body = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #1e293b;">
      <h2 style="color: #2563eb;">Welcome to SpeedRide 2026, ${name}!</h2>
      <p>Your account as a <strong>${role}</strong> has been successfully provisioned.</p>
      ${isDriver ? '<p>Our team is currently reviewing your uploaded documents (License & NIN). We will notify you once you are cleared to start driving.</p>' : '<p>You are now ready to book your first premium ride. The future of mobility awaits.</p>'}
      <br/>
      <p>Best regards,<br/>The SpeedRide Team</p>
    </div>
  `;

  triggerVirtualInterceptor(subject, isDriver ? "Verification is pending." : "Start riding today.");

  try {
    const response = await (window as any).Email.send({
      ...SMTP_CONFIG,
      To: email,
      Subject: subject,
      Body: body
    });
    return response === 'OK';
  } catch (error) {
    console.error("SmtpJS Error:", error);
    return false;
  }
};

export const sendOtpEmail = async (email: string, otp: string) => {
  const subject = `[${otp}] SpeedRide Verification Code`;
  const plainText = `Your secure access code is ${otp}. This code expires in 10 minutes.`;
  const body = `
    <div style="font-family: Arial, sans-serif; padding: 40px; text-align: center; background-color: #f8fafc;">
      <div style="background-color: white; padding: 40px; border-radius: 24px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); max-width: 400px; margin: auto;">
        <h1 style="margin: 0; color: #0f172a; font-size: 24px;">Verify Your Identity</h1>
        <p style="color: #64748b; margin: 20px 0;">Use the code below to complete your SpeedRide 2026 registration.</p>
        <div style="background: #eff6ff; padding: 20px; border-radius: 16px; border: 2px dashed #3b82f6; margin: 30px 0;">
          <span style="font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #2563eb;">${otp}</span>
        </div>
        <p style="font-size: 12px; color: #94a3b8;">If you didn't request this, please ignore this email.</p>
      </div>
    </div>
  `;

  triggerVirtualInterceptor(subject, plainText, otp);

  try {
    const response = await (window as any).Email.send({
      ...SMTP_CONFIG,
      To: email,
      Subject: subject,
      Body: body
    });
    console.log("SmtpJS OTP Response:", response);
    return response === 'OK';
  } catch (error) {
    console.error("SmtpJS Error:", error);
    return false;
  }
};
