export interface User {
    id: string;
    name: string;
    email: string;
}

export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
}

// Export auth types
export * from './auth/auth.types';

// Export facility types
export * from './facility/facility.types';
