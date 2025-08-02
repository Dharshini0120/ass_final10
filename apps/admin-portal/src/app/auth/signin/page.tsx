"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { setCredentials } from '../../../store/authSlice';
import { useDispatch } from 'react-redux';

const SignInPage = () => {
    const router = useRouter();
    const dispatch = useDispatch();

    const handleSignIn = async () => {
        // For demonstration, we're using a static token
        const token = 'SAMPLE_TOKEN';

        // Store the token in a cookie
        document.cookie = `token=${token}; path=/; max-age=86400`; // expires in 1 day

        // Dispatch the setCredentials action to update the Redux store
        dispatch(setCredentials({ token }));

        // Redirect to dashboard
        router.push('/dashboard');
    };

    return (
        <div>
            <h1>Sign In</h1>
            <button onClick={handleSignIn}>Sign In</button>
        </div>
    );
};

export default SignInPage;