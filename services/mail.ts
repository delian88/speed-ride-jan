
interface MailOptions {
  email: string;
  name: string;
  role: 'RIDER' | 'DRIVER';
}

/**
 * SPEEDRIDE 2026 | Mail Service
 * Production Infrastructure: SmtpJS (Real Delivery) + Virtual Interceptor (Instant UX)
 */

const SMTP_CONFIG = {
  Host: "smtp.gmail.com",
  Username: "taiwodele88@gmail.com",
  Password: "ucbznlbhnbogwuer", 
  From: "taiwodele88@gmail.com"
};

const dispatchEmail = async (to: string, subject: string, body: string) => {
  return new Promise<boolean>((resolve) => {
    try {
      const Email = (window as any).Email;
      if (!Email) {
        console.error("Mail Error: SmtpJS library not loaded in window context.");
        resolve(false);
        return;
      }
      
      console.log(`Mail: Initiating transmission to ${to}...`);
      
      Email.send({
        ...SMTP_CONFIG,
        To: to,
        Subject: subject,
        Body: body
      }).then((response: string) => {
        if (response === 'OK') {
          console.log("%c Mail: Transmission Successful (OK)", "color: #10b981; font-weight: bold;");
          resolve(true);
        } else {
          console.error("Mail: Transmission Failed. Server Response:", response);
          // If the response contains "The SMTP server requires a secure connection", 
          // it usually means the Port or Host is incorrect for the relay.
          resolve(false);
        }
      }).catch((err: any) => {
        console.error("Mail: SmtpJS Promise Rejected:", err);
        resolve(false);
      });
    } catch (error) {
      console.error("Mail: Critical Exception during dispatch:", error);
      resolve(false);
    }
  });
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
      <p style="margin-top: 40px; font-size: 12px; color: #94a3b8;">SpeedRide Mobility Inc. | Core Transmission</p>
    </div>
  `;

  return await dispatchEmail(email, subject, body);
};

export const sendOtpEmail = async (email: string, otp: string) => {
  console.log(`Mail: sendOtpEmail called for ${email}`);
  const subject = `[${otp}] SpeedRide Verification Code`;
  const body = `
    <div style="font-family: Arial, sans-serif; padding: 40px; text-align: center; background-color: #f8fafc;">
      <div style="background-color: white; padding: 40px; border-radius: 32px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); max-width: 400px; margin: auto; border: 1px solid #e2e8f0;">
        <h1 style="margin: 0; color: #0f172a; font-size: 24px; font-weight: 800; letter-spacing: -0.025em;">Secure Verification</h1>
        <p style="color: #64748b; margin: 20px 0; font-size: 14px;">Use the access code below to finalize your registration.</p>
        <div style="background: #eff6ff; padding: 24px; border-radius: 20px; border: 2px dashed #3b82f6; margin: 30px 0;">
          <span style="font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #2563eb; font-family: monospace;">${otp}</span>
        </div>
        <p style="font-size: 11px; color: #94a3b8; font-weight: bold; text-transform: uppercase;">Expires in 10 minutes</p>
      </div>
    </div>
  `;

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

  return await dispatchEmail(email, subject, body);
};
