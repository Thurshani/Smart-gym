import nodemailer from 'nodemailer';

// Mock email service for development
const createTransporter = () => {
  // In development, we'll use a mock transporter
  if (process.env.NODE_ENV === 'development') {
    return nodemailer.createTransporter({
      host: 'localhost',
      port: 1025,
      ignoreTLS: true,
    });
  }

  // For production, use real email service
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendGymCredentials = async (
  gymEmail: string,
  gymName: string,
  temporaryPassword: string
): Promise<boolean> => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@fitflow.com',
      to: gymEmail,
      subject: 'Welcome to FitFlow - Your Gym Dashboard Access',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Welcome to FitFlow!</h2>
          
          <p>Dear ${gymName} Team,</p>
          
          <p>Your gym has been successfully registered on our FitFlow platform. Below are your login credentials:</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Email:</strong> ${gymEmail}</p>
            <p><strong>Temporary Password:</strong> ${temporaryPassword}</p>
            <p><strong>Dashboard URL:</strong> ${process.env.FRONTEND_URL}/gym-dashboard</p>
          </div>
          
          <p style="color: #dc2626;"><strong>Important:</strong> Please change your password after your first login for security purposes.</p>
          
          <h3>What you can do with your dashboard:</h3>
          <ul>
            <li>View member visits (daily, weekly, monthly, yearly)</li>
            <li>Export visit reports in CSV or JSON format</li>
            <li>Manage your gym profile and operating hours</li>
            <li>Track member check-ins and token usage</li>
          </ul>
          
          <p>If you have any questions or need assistance, please contact our support team.</p>
          
          <p>Best regards,<br>The FitFlow Team</p>
        </div>
      `,
    };

    // In development, just log the email instead of sending
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 Mock Email Sent:');
      console.log('To:', gymEmail);
      console.log('Subject:', mailOptions.subject);
      console.log('Temporary Password:', temporaryPassword);
      return true;
    }

    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${gymEmail}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}; 