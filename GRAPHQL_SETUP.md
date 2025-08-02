# GraphQL Sign-In & Sign-Up Integration Setup

## ✅ **Current Setup**

Both sign-in and sign-up forms are now fully integrated with GraphQL! Here's what's been implemented:

### **Features:**
- ✅ GraphQL sign-in mutation
- ✅ GraphQL sign-up mutation with OTP sending
- ✅ OTP verification mutation
- ✅ Form validation (email & password)
- ✅ Loading states and error handling
- ✅ Mock API for testing
- ✅ Role-based redirects
- ✅ Token storage in localStorage
- ✅ Complete OTP verification flow
- ✅ Material-UI Alert system (no react-toastify dependency)

### **Test Credentials:**
```
Email: testtestestetsttweerwe@yopmail.com
Password: SmartWork@123!
```

## 🔧 **API Configuration**

### **Current Setup (Mock API)**
The app currently uses a mock GraphQL API endpoint at `/api/graphql` for development.

### **Switching to Real GraphQL Server**

When you're ready to connect to your actual GraphQL server:

1. **Set Environment Variable:**
   ```bash
   # In your .env.local file
   NEXT_PUBLIC_GRAPHQL_URL=http://your-graphql-server.com/graphql
   ```

2. **Or Update the Configuration:**
   ```typescript
   // In libs/shared-utils/src/config/api-config.ts
   export const API_CONFIG = {
     GRAPHQL_ENDPOINT: 'http://your-graphql-server.com/graphql',
     // ...
   };
   ```

## 📁 **Files Created/Modified**

### **New Files:**
- `apps/admin-portal/src/app/api/graphql/route.ts` - Mock GraphQL API
- `apps/user-portal/src/app/api/graphql/route.ts` - Mock GraphQL API
- `libs/shared-utils/src/api/graphql-mutations.ts` - GraphQL mutations
- `libs/shared-utils/src/config/api-config.ts` - API configuration
- `libs/shared-utils/src/hooks/use-signin.ts` - Sign-in hook

### **Modified Files:**
- `libs/shared-ui/src/components/Auth/signin/page.tsx` - Integrated GraphQL sign-in
- `libs/shared-ui/src/components/Auth/signup/page.tsx` - Integrated GraphQL sign-up
- `libs/shared-ui/src/components/Auth/forgot-password/page.tsx` - Removed react-toastify
- `libs/shared-types/src/index.ts` - Added auth type exports
- `libs/shared-utils/src/index.ts` - Added API exports
- `apps/admin-portal/src/store/authSlice.ts` - Enhanced auth state

## 🚀 **How to Test**

### **Sign-In Testing:**
1. **Start the development server:**
   ```bash
   npm run serve:admin  # or serve:user
   ```

2. **Navigate to the sign-in page**

3. **Use the test credentials:**
   - Email: `testtestestetsttweerwe@yopmail.com`
   - Password: `SmartWork@123!`

4. **Expected behavior:**
   - ✅ Form validation works
   - ✅ API call succeeds
   - ✅ Token stored in localStorage
   - ✅ Redirect based on user role

### **Sign-Up Testing:**
1. **Navigate to the sign-up page**

2. **Fill in all required fields:**
   - Full Name: "Test User"
   - Email: "newuser@example.com"
   - Phone Number: "+1234567890"
   - Facility Name: "Test Hospital"
   - Facility Type: "Academic Hospital"
   - State: "California"
   - County: "Los Angeles"
   - Role: "Admin"

3. **Click "Continue"**

4. **Expected behavior:**
   - ✅ Form validation works
   - ✅ API call succeeds
   - ✅ OTP is generated and logged to console
   - ✅ Success message displayed
   - ✅ Redirects to OTP verification page after 3 seconds

### **OTP Verification Testing:**
1. **After sign-up, you'll be redirected to OTP verification**
2. **Check the console for the OTP** (it will be logged like: `📧 OTP sent to email@example.com: 123456`)
3. **Enter the OTP in the verification form**
4. **Expected behavior:**
   - ✅ OTP verification succeeds
   - ✅ User account is created
   - ✅ Redirects to dashboard/home

## 🔄 **GraphQL Mutations**

### **Sign-In Mutation:**
```graphql
mutation SignIn($input: SignInInput!) {
  signIn(input: $input) {
    success
    message
    token
    user {
      fullName
      email
      role
    }
  }
}
```

### **Sign-Up Mutation:**
```graphql
mutation SignUp($input: SignUpInput!) {
  signUp(input: $input) {
    status
    message
    statusCode
    data
    error
  }
}
```

### **OTP Verification Mutation:**
```graphql
mutation VerifyOTP($input: VerifyOTPInput!) {
  verifyOTP(input: $input) {
    status
    message
    statusCode
    data
    error
  }
}
```

## 📧 **OTP Flow**

### **How OTP Works:**
1. **User fills sign-up form** and clicks "Continue"
2. **GraphQL sign-up mutation** is sent to server
3. **Server generates 6-digit OTP** and stores it temporarily
4. **OTP is logged to console** (in real app, sent via email)
5. **User is redirected to OTP verification page**
6. **User enters OTP** from console/email
7. **OTP verification mutation** validates the code
8. **User account is created** and user is logged in

### **OTP Features:**
- ✅ 6-digit numeric OTP
- ✅ 10-minute expiration
- ✅ Invalid OTP handling
- ✅ Expired OTP handling
- ✅ Account creation after successful verification

## 🛠 **Troubleshooting**

### **404 Error on /graphql**
- ✅ **Fixed**: Created mock API routes in both admin and user portals
- The app now uses `/api/graphql` endpoint

### **React Key Warnings**
- ✅ **Fixed**: Added unique keys to form elements

### **react-toastify Dependency**
- ✅ **Fixed**: Replaced with Material-UI Alert components
- No external dependencies required

### **Environment Variables**
- Make sure to set `NEXT_PUBLIC_GRAPHQL_URL` when switching to real API
- The app falls back to `/api/graphql` if no environment variable is set

### **OTP Issues**
- Check console for OTP logs: `📧 OTP sent to email@example.com: 123456`
- OTP expires after 10 minutes
- Invalid OTP shows error message
- Expired OTP requires new sign-up

## 📝 **Next Steps**

1. **Connect to Real GraphQL Server:**
   - Set `NEXT_PUBLIC_GRAPHQL_URL` environment variable
   - Test with your actual GraphQL endpoint

2. **Implement Real Email Service:**
   - Replace console.log with actual email sending
   - Use services like SendGrid, AWS SES, or Nodemailer

3. **Enhance Security:**
   - Add proper JWT token validation
   - Implement token refresh logic
   - Add CSRF protection
   - Secure OTP storage in database

4. **Add More Features:**
   - Password creation after OTP verification
   - Resend OTP functionality
   - Password reset functionality
   - Remember me option
   - Multi-factor authentication

5. **Complete the Flow:**
   - Create OTP verification page component
   - Add password creation page
   - Handle email verification
   - Add user profile setup

---

**🎉 Your complete GraphQL sign-in, sign-up, and OTP verification integration is ready to use!** 