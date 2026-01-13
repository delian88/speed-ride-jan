
declare const Email: any;

interface MailOptions {
  email: string;
  name: string;
  role: 'RIDER' | 'DRIVER';
}

export const sendWelcomeEmail = async ({ email, name, role }: MailOptions) => {
  const isDriver = role === 'DRIVER';
  const subject = isDriver 
    ? "Welcome to the Fleet, Partner! | SpeedRide 2026" 
    : "Your Journey Begins Now | SpeedRide 2026";

  const body = `
    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: auto; border: 1px solid #f1f5f9; border-radius: 24px; overflow: hidden; color: #1e293b;">
      <div style="background: #2563eb; padding: 40px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -1px;">SPEEDRIDE</h1>
        <p style="margin: 10px 0 0; opacity: 0.8; font-weight: 700; text-transform: uppercase; font-size: 10px; letter-spacing: 2px;">2026 Mobility Edition</p>
      </div>
      <div style="padding: 40px; line-height: 1.6;">
        <h2 style="font-size: 24px; font-weight: 800; color: #0f172a; margin-top: 0;">Hello ${name},</h2>
        <p style="font-size: 16px; font-weight: 500;">
          Welcome to the future of urban mobility. Your account has been successfully provisioned on the 
          <strong>SpeedRide 2026</strong> global network.
        </p>
        <p style="font-size: 16px; font-weight: 500;">
          ${isDriver 
            ? "Our verification squad is currently reviewing your documents. You will receive a notification the moment you are cleared to start earning."
            : "You are now ready to experience the fastest, safest, and most premium ride-hailing service in the city."}
        </p>
        <div style="margin: 40px 0; text-align: center;">
          <a href="https://speedride-2026.vercel.app" style="background: #0f172a; color: white; padding: 18px 36px; border-radius: 16px; text-decoration: none; font-weight: 800; font-size: 14px; display: inline-block;">
            LAUNCH DASHBOARD
          </a>
        </div>
        <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 40px 0;">
        <p style="font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">SpeedRide Support</p>
        <p style="font-size: 12px; font-weight: 500; color: #64748b; margin: 0;">24/7 Global Response Unit • Lagos, Nigeria</p>
      </div>
      <div style="background: #f8fafc; padding: 20px; text-align: center; font-size: 10px; font-weight: 700; color: #cbd5e1; text-transform: uppercase; letter-spacing: 2px;">
        Powered by Premegage Tech • 2026
      </div>
    </div>
  `;

  try {
    const response = await Email.send({
      Host: "smtp.gmail.com",
      Username: "walpconsult@gmail.com",
      Password: "mjbhowjkzmfxqrgd",
      To: email,
      From: "walpconsult@gmail.com",
      Subject: subject,
      Body: body
    });
    console.log("Welcome email status:", response);
    return response === 'OK';
  } catch (error) {
    console.error("Failed to send welcome email:", error);
    return false;
  }
};
