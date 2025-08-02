import nodemailer from 'nodemailer';

// Email configuration
const emailConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'your-email@gmail.com',
    pass: process.env.SMTP_PASS || 'your-app-password',
  },
};

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport(emailConfig);
};

// Email templates
const getOTPEmailTemplate = (otp: string, userName: string) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>OTP Verification</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #4285F4;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          background-color: #f9f9f9;
          padding: 30px;
          border-radius: 0 0 8px 8px;
        }
        .otp-box {
          background-color: #4285F4;
          color: white;
          padding: 15px;
          text-align: center;
          border-radius: 8px;
          font-size: 24px;
          font-weight: bold;
          margin: 20px 0;
          letter-spacing: 5px;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          color: #666;
          font-size: 14px;
        }
        .warning {
          background-color: #fff3cd;
          border: 1px solid #ffeaa7;
          color: #856404;
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Healthcare Assessment Platform</h1>
        <p>OTP Verification</p>
      </div>
      
      <div class="content">
        <h2>Hello ${userName},</h2>
        
        <p>Thank you for registering with our Healthcare Assessment Platform. To complete your registration, please use the following OTP (One-Time Password):</p>
        
        <div class="otp-box">
          ${otp}
        </div>
        
        <p><strong>This OTP will expire in 10 minutes.</strong></p>
        
        <div class="warning">
          <strong>Important:</strong> Please do not share this OTP with anyone. Our team will never ask for your OTP over phone or email.
        </div>
        
        <p>If you didn't request this OTP, please ignore this email.</p>
        
        <p>Best regards,<br>
        Healthcare Assessment Team</p>
      </div>
      
      <div class="footer">
        <p>This is an automated email. Please do not reply to this message.</p>
        <p>&copy; 2024 Healthcare Assessment Platform. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
};

// Send OTP email
export const sendOTPEmail = async (email: string, otp: string, userName: string): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Healthcare Assessment" <${emailConfig.auth.user}>`,
      to: email,
      subject: 'OTP Verification - Healthcare Assessment Platform',
      html: getOTPEmailTemplate(otp, userName),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return false;
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email: string, resetLink: string, userName: string): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Healthcare Assessment" <${emailConfig.auth.user}>`,
      to: email,
      subject: 'Password Reset - Healthcare Assessment Platform',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Password Reset</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #4285F4;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background-color: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 8px 8px;
            }
            .button {
              background-color: #4285F4;
              color: white;
              padding: 15px 30px;
              text-decoration: none;
              border-radius: 8px;
              display: inline-block;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #666;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Healthcare Assessment Platform</h1>
            <p>Password Reset Request</p>
          </div>
          
          <div class="content">
            <h2>Hello ${userName},</h2>
            
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            
            <a href="${resetLink}" class="button">Reset Password</a>
            
            <p>If you didn't request a password reset, please ignore this email.</p>
            
            <p>Best regards,<br>
            Healthcare Assessment Team</p>
          </div>
          
          <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>&copy; 2024 Healthcare Assessment Platform. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Password reset email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    return false;
  }
};

// Test email configuration
export const testEmailConfig = async (): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Email configuration is valid');
    return true;
  } catch (error) {
    console.error('❌ Email configuration error:', error);
    return false;
  }
}; 