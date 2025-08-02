export const formatDate = (date: Date) => date.toLocaleDateString();

// Export API utilities
export * from './api/api-client';
export * from './api/graphql-mutations';
export * from './config/api-config';

// Export email services
export * from './services/email-service';
