/* eslint-disable @typescript-eslint/no-explicit-any */
export interface SignUpFormData {
  firstName: string;
  lastName?: string;
  email: string;
  phoneNumber: string;
  password?: string;
  confirmPassword?: string;
  facilityName?: string;
  facilityType?: string;
  state?: string;
  county?: string;
  role?: string;
}

// Add SignUpInput interface for GraphQL
export interface SignUpInput {
  fullName: string;
  email: string;
  phoneNumber: string;
  facilityName: string;
  facilityType: string;
  state: string;
  county: string;
  numberOfLicensedBeds: number;
  serviceLines: string[];
}

// Add SignUpResponse interface
export interface SignUpResponse {
  status: boolean;
  message: string;
  statusCode: number;
  data: any;
  error: string | null;
}

export type UserType = 'user' | 'admin';

export type AuthStep = {
  step: 'signup' | 'otp';
  data?: SignUpFormData;
};

// GraphQL Sign In Types
export interface SignInInput {
  emailOrPhone: string;
  password: string;
}

export interface User {
  fullName: string;
  email: string;
  role: string;
}

export interface SignInResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface SignInData {
  signIn: SignInResponse;
}

// Add VerifyOtp interfaces
export interface VerifyOtpInput {
  email: string;
  otpCode: string;
}

export interface VerifyOtpResponse {
  status: string;
  message: string;
  statusCode: number;
  data: string;
  error: string | null;
}

// Add SetPassword interfaces
export interface SetPasswordInput {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SetPasswordResponse {
  status: string;
  message: string;
  statusCode: number;
  data: string;
  error: string | null;
}

export interface ForgotPasswordInput {
  email: string;
}

// Add ServiceLine interfaces
export interface ServiceLine {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetServiceLinesData {
  getServiceLines: {
    status: boolean;
    message: string;
    statusCode: number;
    data: ServiceLine[];
    error: string | null;
  };
}

export interface ResendOtpInput {
  email: string;
}

export interface ResendOtpResponse {
  status: string;
  message: string;
  statusCode: number;
  data: string;
  error: string | null;
}
