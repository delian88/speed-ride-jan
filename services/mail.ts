
interface MailOptions {
  email: string;
  name: string;
  role: 'RIDER' | 'DRIVER';
}

/**
 * SPEEDRIDE 2026 | Neural Mail Service
 * Production Infrastructure: SmtpJS (Real Delivery) + Neural Virtual Interceptor (Instant UX)
 */

const SMTP_CONFIG = {
  Host: "smtp.gmail.com",
  Username: "walpconsult@gmail.com",
  Password: "mjbhowjkzmfxqrgd", 
  From: "walpconsult@gmail.com"
};

const triggerVirtualInterceptor = (subject: string, body: string, otp?: string) => {
  const event = new CustomEvent('speedride_mail_intercept', { 
    detail: { subject, body, otp, timestamp: new Date().toLocaleTimeString() } 
  });
  window.dispatchEvent(event);
  console.log(`%c SpeedRide Interceptor | ${subject}`, 'background: #1e293b; color: #3b82f6; padding: 4px 8px; font-weight: bold; border-radius: 4px;');
};

const dispatchEmail = async (to: string, subject: string, body: string) => {
  try {
    const Email = (window as any).Email;
    if (!Email) return false;
    const response = await Email.send({
      ...SMTP_CONFIG,
      To: to,
      Subject: subject,
      Body: body
    });
    return response === 'OK';
  } catch (error) {
    console.error("Mail Transmission Error:", error);
    return false;
  }
};

export const sendWelcomeEmail = async ({ email, name, role }: MailOptions) => {
  const isDriver = role === 'DRIVER';
  const subject = isDriver 
    ? "Welcome to the Fleet, Partner! | SpeedRide 2026" 
    : "Your Journey Begins Now | SpeedRide 2026";

  const body = `
    <div style="font-family: Arial, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6;">
      <h2 style="color: #2563eb; margin-bottom: 24px;">Greetings, ${name}!</h2>
      <p>Your account as a <strong>${role}</strong> has been successfully provisioned within the SpeedRide 2026 ecosystem.</p>
      ${isDriver 
        ? '<p style="background: #f8fafc; padding: 20px; border-radius: 12px; border-left: 4px solid #2563eb;">Our safety team is currently reviewing your uploaded documents. You will receive a notification once your node is verified for live dispatch.</p>' 
        : '<p>You are now connected to the most advanced mobility grid. Your first premium ride is just a tap away.</p>'}
      <p style="margin-top: 40px; font-size: 12px; color: #94a3b8;">SpeedRide Mobility Inc. | Neural Core Transmission</p>
    </div>
  `;

  triggerVirtualInterceptor(subject, isDriver ? "Document verification in progress." : "Account initialized.");
  return await dispatchEmail(email, subject, body);
};

export const sendOtpEmail = async (email: string, otp: string) => {
  const subject = `[${otp}] SpeedRide Verification Code`;
  const body = `
    <div style="font-family: Arial, sans-serif; padding: 40px; text-align: center; background-color: #f8fafc;">
      <div style="background-color: white; padding: 40px; border-radius: 32px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); max-width: 400px; margin: auto; border: 1px solid #e2e8f0;">
        <h1 style="margin: 0; color: #0f172a; font-size: 24px; font-weight: 800; letter-spacing: -0.025em;">Secure Verification</h1>
        <p style="color: #64748b; margin: 20px 0; font-size: 14px;">Use the neural access code below to finalize your registration.</p>
        <div style="background: #eff6ff; padding: 24px; border-radius: 20px; border: 2px dashed #3b82f6; margin: 30px 0;">
          <span style="font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #2563eb; font-family: monospace;">${otp}</span>
        </div>
        <p style="font-size: 11px; color: #94a3b8; font-weight: bold; text-transform: uppercase;">Expires in 10 minutes</p>
      </div>
    </div>
  `;

  triggerVirtualInterceptor(subject, `Neural OTP Transmission: ${otp}`, otp);
  return await dispatchEmail(email, subject, body);
};

export const sendResetEmail = async (email: string, otp: string) => {
  const subject = `Recovery Transmission | SpeedRide | ${otp}`;
  const body = `
    <div style="font-family: Arial, sans-serif; padding: 40px; text-align: center; background-color: #f1f5f9;">
      <div style="background-color: white; padding: 40px; border-radius: 40px; max-width: 450px; margin: auto; border: 1px solid #e2e8f0;">
        <h2 style="color: #0f172a; margin-bottom: 10px; font-weight: 800;">Password Recovery</h2>
        <p style="color: #64748b; font-size: 14px;">Enter the following code to authorize your password update.</p>
        <div style="background: #1e293b; color: white; padding: 24px; border-radius: 24px; margin: 30px 0; font-size: 32px; font-weight: 900; letter-spacing: 6px; font-family: monospace;">
          ${otp}
        </div>
        <p style="font-size: 11px; color: #94a3b8; font-weight: bold;">If you did not initiate this request, contact system security immediately.</p>
      </div>
    </div>
  `;

  triggerVirtualInterceptor("Recovery Signal Detected", "Secure access requested.", otp);
  return await dispatchEmail(email, subject, body);
};
