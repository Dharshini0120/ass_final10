import { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Grid,
  useMediaQuery,
  useTheme,
  Link
} from '@mui/material';

interface OTPVerificationProps {
  phoneNumber: string;
  onVerify: (code: string) => void;
  onResend: () => void;
  onBack: () => void;
  loading?: boolean;
  resendTimeout?: number;
}

export const OTPVerification = ({ 
  phoneNumber, 
  onVerify, 
  onResend, 
  onBack, 
  loading = false,
  resendTimeout = 60
}: OTPVerificationProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [timeLeft, setTimeLeft] = useState(resendTimeout);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!timeLeft) return;
    
    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timerId);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleChange = (index: number, value: string) => {
    // Allow only numbers
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.substring(0, 1);
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    
    // Check if pasted content is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length === 6) {
      onVerify(otpString);
    }
  };

  const handleResend = () => {
    onResend();
    setTimeLeft(resendTimeout);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 500, mx: 'auto' }}>
      <Grid container spacing={1} justifyContent="center">
        {otp.map((digit, index) => (
          <Grid item key={index} xs={1.5}>
            <TextField
              inputRef={el => inputRefs.current[index] = el}
              fullWidth
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              inputProps={{
                maxLength: 1,
                style: { 
                  textAlign: 'center', 
                  fontSize: '1.5rem',
                  padding: '0.75rem 0'
                }
              }}
              variant="outlined"
              autoComplete="off"
              disabled={loading}
            />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          disabled={loading || otp.join('').length !== 6}
          sx={{ 
            width: isMobile ? '100%' : 300,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem'
          }}
        >
          {loading ? 'Verifying...' : 'Continue'}
        </Button>
      </Box>

      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Didn't receive the code? 
          {timeLeft > 0 ? (
            <span> Resend in {formatTime(timeLeft)}</span>
          ) : (
            <Link 
              component="button" 
              type="button" 
              onClick={handleResend} 
              sx={{ ml: 1, textDecoration: 'none' }}
            >
              Resend
            </Link>
          )}
        </Typography>
      </Box>
    </Box>
  );
};