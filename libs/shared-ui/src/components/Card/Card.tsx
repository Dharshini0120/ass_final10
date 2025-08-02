import { Card as MuiCard, CardContent, CardProps } from '@mui/material';
import { ReactNode } from 'react';

interface HealthcareCardProps extends CardProps {
  children: ReactNode;
}

export const Card = ({ children, className, ...props }: HealthcareCardProps) => {
  return (
    <MuiCard 
      className={`healthcare-card ${className || ''}`}
      {...props}
    >
      <CardContent>
        {children}
      </CardContent>
    </MuiCard>
  );
};