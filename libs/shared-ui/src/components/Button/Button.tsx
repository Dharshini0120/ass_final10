import { Button as MuiButton, ButtonProps } from '@mui/material';
import { forwardRef } from 'react';

interface HealthcareButtonProps extends ButtonProps {
  variant?: 'primary' | 'secondary' | 'outlined';
}

export const Button = forwardRef<HTMLButtonElement, HealthcareButtonProps>(
  ({ variant = 'primary', className, ...props }, ref) => {
    const getVariantProps = () => {
      switch (variant) {
        case 'primary':
          return { variant: 'contained' as const, color: 'primary' as const };
        case 'secondary':
          return { variant: 'contained' as const, color: 'secondary' as const };
        case 'outlined':
          return { variant: 'outlined' as const, color: 'primary' as const };
        default:
          return { variant: 'contained' as const, color: 'primary' as const };
      }
    };

    return (
      <MuiButton
        ref={ref}
        {...getVariantProps()}
        className={`healthcare-button ${className || ''}`}
        {...props}
      />
    );
  }
);