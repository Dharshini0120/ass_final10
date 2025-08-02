import { SignInInput, SignInData } from '@healthcare-assessment/shared-types';

export const SIGN_IN_MUTATION = `
  mutation SignIn($input: SignInInput!) {
    signIn(input: $input) {
      success
      message
      token
      user {
        fullName
        email
        role
      }
    }
  }
`;

export const signInMutation = (input: SignInInput) => ({
  query: SIGN_IN_MUTATION,
  variables: { input }
}); 