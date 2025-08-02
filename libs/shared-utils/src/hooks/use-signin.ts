import { useState } from 'react';
import { graphqlClient } from '../api/api-client';
import { signInMutation } from '../api/graphql-mutations';
import { SignInInput, SignInData } from '@healthcare-assessment/shared-types';

interface UseSignInReturn {
  signIn: (input: SignInInput) => Promise<SignInData>;
  loading: boolean;
  error: string | null;
}

export const useSignIn = (): UseSignInReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async (input: SignInInput): Promise<SignInData> => {
    setLoading(true);
    setError(null);
    
    try {
      const mutation = signInMutation(input);
      const result = await graphqlClient.mutate<SignInData>(mutation.query, mutation.variables);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign in failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { signIn, loading, error };
}; 