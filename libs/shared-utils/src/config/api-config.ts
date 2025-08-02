// API Configuration
export const API_CONFIG = {
  // Set this to your actual GraphQL server URL when ready
  GRAPHQL_ENDPOINT: process.env.NEXT_PUBLIC_GRAPHQL_URL || '/api/graphql',
  
  // Mock API settings
  USE_MOCK_API: process.env.NODE_ENV === 'development',
  
  // Timeout settings
  REQUEST_TIMEOUT: 10000, // 10 seconds
};

// Helper function to get the correct GraphQL endpoint
export const getGraphQLEndpoint = (): string => {
  if (API_CONFIG.USE_MOCK_API) {
    return '/api/graphql';
  }
  return API_CONFIG.GRAPHQL_ENDPOINT;
}; 