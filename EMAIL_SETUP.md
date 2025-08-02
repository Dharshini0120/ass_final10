# Email Setup for OTP Verification

## ✅ **Real Email Service Implemented**

Your OTP verification now uses a real email service! When users register, they will receive an actual email with the OTP.

## 🔧 **Email Configuration**

### **1. Create Environment File**

Create a `.env.local` file in your project root:

```bash
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### **2. Gmail Setup (Recommended)**

#### **Step 1: Enable 2-Factor Authentication**
1. Go to your Google Account settings
2. Enable 2-Factor Authentication

#### **Step 2: Generate App Password**
1. Go to Google Account → Security
2. Under "2-Step Verification", click "App passwords"
3. Generate a new app password for "Mail"
4. Use this password as `SMTP_PASS`

#### **Step 3: Update Environment Variables**
```bash
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-16-digit-app-password
```

### **3. Alternative Email Services**

#### **Outlook/Hotmail**
```bash
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

#### **Yahoo Mail**
```bash
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password
```

#### **Custom SMTP Server**
```bash
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASS=your-password
```

## 🧪 **Testing Email Setup**

### **1. Test with Yopmail**
For testing, you can use Yopmail (temporary email):
- Register with: `test@yopmail.com`
- Check emails at: https://yopmail.com

### **2. Test with Real Email**
- Use your own email address for testing
- Check your inbox for the OTP email

## 📧 **Email Template Features**

The OTP email includes:
- ✅ Professional HTML template
- ✅ Healthcare Assessment branding
- ✅ Clear OTP display
- ✅ Security warnings
- ✅ 10-minute expiration notice
- ✅ Responsive design

## 🚀 **How to Test**

1. **Set up environment variables** (see above)
2. **Restart your development server**
3. **Go to sign-up page**
4. **Fill the form with a real email address**
5. **Click "Continue"**
6. **Check your email inbox**
7. **Use the OTP from email to verify**

## 🔍 **Troubleshooting**

### **Email Not Sending**
1. **Check environment variables** are set correctly
2. **Verify Gmail app password** is correct
3. **Check console logs** for error messages
4. **Ensure 2FA is enabled** on Gmail account

### **Common Errors**
- `Invalid login`: Wrong app password
- `Authentication failed`: 2FA not enabled
- `Connection timeout`: Check SMTP settings

### **Gmail App Password Issues**
1. Make sure 2-Factor Authentication is enabled
2. Generate a new app password specifically for "Mail"
3. Use the 16-character app password (not your regular password)

## 📝 **Production Setup**

For production, consider using:
- **SendGrid**: Professional email service
- **AWS SES**: Scalable email service
- **Mailgun**: Developer-friendly email API
- **Postmark**: Transactional email service

### **SendGrid Example**
```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

## 🎉 **Success Indicators**

When email is working correctly:
- ✅ Console shows: `📧 Email sent successfully: <message-id>`
- ✅ User receives professional OTP email
- ✅ Email contains the correct 6-digit OTP
- ✅ User can verify account with the OTP

---

**🎉 Your OTP email system is now ready to send real emails!** 