// resources/js/Layouts/AppLayout.tsx
import AppNavbar from '@/components/AppNavbar';
import React from 'react';

type AppLayoutProps = {
    children: React.ReactNode;
};

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-[#F9FAFB]">
            <AppNavbar />
            <main>{children}</main>
        </div>
    );
};

export default AppLayout;
