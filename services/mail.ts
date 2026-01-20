
interface MailOptions {
  email: string;
  name: string;
  role: 'RIDER' | 'DRIVER';
}

/**
 * SPEEDRIDE 2026 | Neural Mail Service
 * Uses EmailJS with a Virtual Interceptor fallback for local development and demo purposes.
 */

// Initialize EmailJS with your Public Key if available
// (window as any).emailjs?.init("YOUR_PUBLIC_KEY");

const triggerVirtualInterceptor = (subject: string, body: string, otp?: string) => {
  // Dispatch a custom event that AuthPage can listen for to show the Virtual Inbox
  const event = new CustomEvent('speedride_mail_intercept', { 
    detail: { subject, body, otp, timestamp: new Date().toLocaleTimeString() } 
  });
  window.dispatchEvent(event);
  console.log(`%c SpeedRide Mail Interceptor | ${subject}`, 'background: #2563eb; color: #fff; padding: 2px 5px; border-radius: 4px;', { body, otp });
};

export const sendWelcomeEmail = async ({ email, name, role }: MailOptions) => {
  const isDriver = role === 'DRIVER';
  const subject = isDriver 
    ? "Welcome to the Fleet, Partner! | SpeedRide 2026" 
    : "Your Journey Begins Now | SpeedRide 2026";

  const body = `Welcome ${name}! Your SpeedRide 2026 account is active. ${isDriver ? 'Verification is pending.' : 'Start riding today.'}`;

  // 1. Trigger the Virtual Interceptor UI (Ensures user can see content immediately)
  triggerVirtualInterceptor(subject, body);

  // 2. Real EmailJS Send Attempt
  try {
    if ((window as any).emailjs) {
      // Note: Replace these with your actual Service ID, Template ID
      // await (window as any).emailjs.send("service_id", "template_id", {
      //   to_email: email,
      //   to_name: name,
      //   subject: subject,
      //   message: body
      // });
    }
    return true;
  } catch (error) {
    console.error("EmailJS Error:", error);
    return false;
  }
};

export const sendOtpEmail = async (email: string, otp: string) => {
  const subject = `Your SpeedRide Verification Code: ${otp}`;
  const body = `Your secure access code is ${otp}. This code expires in 10 minutes.`;

  // 1. Trigger the Virtual Interceptor UI
  triggerVirtualInterceptor(subject, body, otp);

  // 2. Real EmailJS Send Attempt
  try {
    if ((window as any).emailjs) {
      // await (window as any).emailjs.send("service_id", "otp_template_id", {
      //   to_email: email,
      //   otp_code: otp,
      // });
    }
    return true;
  } catch (error) {
    console.error("EmailJS Error:", error);
    return false;
  }
};
