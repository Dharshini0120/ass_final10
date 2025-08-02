import { healthcareColors } from './colors';

export const sharedTailwindConfig = {
  theme: {
    extend: {
      colors: {
        primary: healthcareColors.primary,
        secondary: healthcareColors.secondary,
        success: healthcareColors.success,
        warning: healthcareColors.warning,
        error: healthcareColors.error,
      },
    },
  },
};
