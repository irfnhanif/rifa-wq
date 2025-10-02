import { usePage } from '@inertiajs/react';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'USER' | 'ADMIN';
}

export const useAuth = () => {
    const { auth } = usePage<{ auth: { user: User | null } }>().props;

    return {
        user: auth.user,
        isAuthenticated: !!auth.user,
        isAdmin: auth.user?.role === 'ADMIN',
        isUser: auth.user?.role === 'USER',
        role: auth.user?.role,
    };
};
