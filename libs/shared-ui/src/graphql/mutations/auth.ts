import { gql } from '@apollo/client';

export const SIGNIN_MUTATION = gql`
  mutation SignIn($input: SignInInput!) {
    signIn(input: $input) {
      status
      message
      statusCode
      data
      error
    }
  }
`;

export const SIGNUP_MUTATION = gql`
  mutation SignUp($input: SignUpInput!) {
    signUp(input: $input) {
      status
      message
      statusCode
      data
      error
    }
  }
`;

export const VERIFY_OTP_MUTATION = gql`
  mutation VerifyOtp($input: VerifyOtpInput!) {
    verifyOtp(input: $input) {
      status
      message
      statusCode
      data
      error
    }
  }
`;

export const SET_PASSWORD_MUTATION = gql`
  mutation SetPassword($input: SetPasswordInput!) {
    setPassword(input: $input) {
      status
      message
      statusCode
      data
      error
    }
  }
`;

export const FORGOT_PASSWORD_MUTATION = gql`
  mutation ForgotPassword($input: ForgotPasswordInput!) {
    forgotPassword(input: $input) {
      status
      message
      statusCode
      data
      error
    }
  }
`;

export const RESEND_OTP_MUTATION = gql`
  mutation ResendOtp($input: ResendOtpInput!) {
    resendOtp(input: $input) {
      status
      message
      statusCode
      data
      error
    }
  }
`;
