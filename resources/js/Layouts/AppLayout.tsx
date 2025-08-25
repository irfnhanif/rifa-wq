// resources/js/Layouts/AppLayout.tsx
import AppNavbar from '@/Components/AppNavbar';
import React from 'react';

type AppLayoutProps = {
    children: React.ReactNode;
};

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
    return (
        <div className="bg-background-soft min-h-screen">
            <AppNavbar />
            <main>{children}</main>
        </div>
    );
};

export default AppLayout;
