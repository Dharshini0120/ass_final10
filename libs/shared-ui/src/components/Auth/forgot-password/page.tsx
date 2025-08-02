'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import {
  Box,
  Button,
  Typography,
  TextField,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { Email } from '@mui/icons-material';
import { Inter } from 'next/font/google';
import { toast, ToastContainer } from 'react-toastify';
import { useMutation } from '@apollo/client';
import { FORGOT_PASSWORD_MUTATION } from '../../../graphql/mutations/auth';
import { useRouter } from 'next/navigation';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

interface ForgotPasswordInput {
  email: string;
}

const ForgotPasswordPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [shake, setShake] = useState(false);

  const [forgotPassword, { loading }] = useMutation(FORGOT_PASSWORD_MUTATION);

  const validateEmailFormat = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (!value) {
      setErrors({ email: 'Email is required' });
    } else if (!validateEmailFormat(value)) {
      setErrors({ email: 'Please enter a valid email address' });
    } else {
      setErrors({});
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!email) {
    setErrors({ email: 'Email is required' });
    triggerShake();
    return;
  }

  if (!validateEmailFormat(email)) {
    setErrors({ email: 'Please enter a valid email address' });
    triggerShake();
    return;
  }

  try {
    const input: ForgotPasswordInput = { email };
    const response = await forgotPassword({ variables: { input } });

    const result = response.data.forgotPassword;
    console.log('Forgot Password response:', result);

    const apiMessage = result.message || 'Something went wrong';

    if (result.status === 'success') {
      setErrors({});
      toast.success(apiMessage);
      console.log('Password reset link sent to:', email);

      // Redirect to OTP page after a short delay
      setTimeout(() => {
        router.push(`/auth/otp-verification?email=${encodeURIComponent(email)}&context=reset`);
      }, 1500);
    } else {
      toast.error(apiMessage);
      triggerShake();
    }
  } catch (error) {
    console.error('Forgot Password error:', error);
    toast.error('An unexpected error occurred. Please try again.');
    triggerShake();
  }
};


  return (
    <Box
      className={`${inter.className}`}
      minHeight="100vh"
      display="flex"
      position="relative"
      bgcolor="#fff"
    >
      <ToastContainer />

      {/* Background Overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: "url('/login_bg.svg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.07,
          zIndex: 0,
        }}
      />

      {/* Left Section */}
      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        px={{ xs: 4, md: 16 }}
        py={6}
        position="relative"
        zIndex={1}
      >
        {/* Logo */}
        <Box display="flex" justifyContent="center" mb={4}>
          <Image
            src="/medical-logo.png"
            alt="Company Logo"
            width={160}
            height={160}
            style={{ objectFit: 'contain' }}
            priority
          />
        </Box>

        {/* Form Section */}
        <Box maxWidth="md" mx="auto" width="100%">
          <Box mb={6} textAlign="center">
            <Typography
              variant="h5"
              fontWeight={700}
              fontSize={28}
              color="#3D3D3D"
            >
              Forgot Password
            </Typography>
            <Typography
              variant="body1"
              color="#6b7280"
              sx={{
                fontSize: '16px',
                mt: 1.5,
                textAlign: 'center',
                maxWidth: '420px',
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              Enter the email you used to create your account so we can send you
              instructions on how to reset your password.
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            display="flex"
            flexDirection="column"
            gap={3}
            maxWidth={500}
            width="100%"
            mx="auto"
            className={shake ? 'shake' : ''}
          >
            <TextField
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={handleBlur}
              label="Email"
              placeholder="Email"
              fullWidth
              error={!!errors.email}
              helperText={errors.email || ' '}
              FormHelperTextProps={{
                sx: { minHeight: '20px' },
              }}
              InputLabelProps={{
                shrink: true,
                sx: {
                  fontSize: '0.95rem',
                  color: '#9ca3af',
                  '&.Mui-focused': { color: '#9ca3af' },
                  transform: 'translate(14px, 16px) scale(1)',
                  '&.MuiInputLabel-shrink': {
                    transform: 'translate(14px, -8px) scale(0.85)',
                    backgroundColor: '#fff',
                    px: 0.5,
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ pr: 1 }}>
                    <Email fontSize="small" style={{ opacity: 0.7 }} />
                    <Box
                      sx={{
                        height: 28,
                        width: '1px',
                        bgcolor: '#b0b0b0',
                        ml: 1,
                      }}
                    />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: '12px',
                  backgroundColor: '#fff',
                  '& fieldset': { borderColor: '#a8a8a8' },
                  '&:hover fieldset': { borderColor: '#808080' },
                  '&.Mui-focused fieldset': { borderColor: '#4285F4' },
                  fontSize: '1rem',
                  py: 0.5,
                },
              }}
              variant="outlined"
            />

            {/* Button with Loader & Text */}
            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={loading}
              sx={{
                backgroundColor: '#4285F4',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: '8px',
                py: 2,
                fontSize: '18px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 1.5,
                '&:hover': { backgroundColor: '#3367D6' },
              }}
            >
              {loading ? (
                <>
                  Sending...
                  <CircularProgress size={22} sx={{ color: '#fff' }} />
                </>
              ) : (
                'Continue'
              )}
            </Button>
          </Box>
        </Box>

        {/* Bottom Text */}
        <Box mt={6} px={{ xs: 2, sm: 4, md: 6 }}>
          <Typography
            variant="body1"
            sx={{
              color: '#6b7280',
              textAlign: 'center',
              maxWidth: '90%',
              mx: 'auto',
              lineHeight: 1.7,
              fontSize: { xs: '0.8rem', sm: '0.85rem', md: '16px' },
            }}
          >
            Join our platform to securely manage your healthcare facility,
            collaborate with your team, and access tools that enhance patient
            care.
          </Typography>
        </Box>
      </Box>

      {/* Right Image */}
      <Box
        sx={{
          display: { xs: 'none', lg: 'flex' },
          flex: 1.1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
          borderRadius: '0 24px 24px 0',
          overflow: 'hidden',
        }}
      >
        <Image
          src="/login_bg.svg"
          alt="Doctor"
          layout="intrinsic"
          width={700}
          height={800}
          style={{
            objectFit: 'cover',
            width: '100%',
            height: '100%',
            borderRadius: '0 24px 24px 0',
          }}
          priority
        />
      </Box>

      {/* Shake Animation */}
      <style jsx global>{`
        .shake {
          animation: shake 0.4s ease;
        }
        @keyframes shake {
          0% {
            transform: translateX(0px);
          }
          25% {
            transform: translateX(-4px);
          }
          50% {
            transform: translateX(4px);
          }
          75% {
            transform: translateX(-4px);
          }
          100% {
            transform: translateX(0px);
          }
        }
      `}</style>
    </Box>
  );
};

export default ForgotPasswordPage;
