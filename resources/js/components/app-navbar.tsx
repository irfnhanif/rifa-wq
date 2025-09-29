import { Notification } from '@/types/Notification';
import { Link, router, usePage } from '@inertiajs/react';
import { Avatar, Button, Dropdown, DropdownHeader, DropdownItem, Navbar, NavbarBrand, Popover } from 'flowbite-react';
import { Bell, LogOut } from 'lucide-react';
import React, { useState } from 'react';
import NotificationPopover from './notification-popover';

interface SharedProps {
    auth: {
        user: {
            id: string;
            name: string;
            email: string;
        } | null;
    };
    notifications: Notification[];
    [key: string]: any;
}

const AppNavbar: React.FC = () => {
    const { auth, notifications } = usePage<SharedProps>().props;
    const [localNotifications, setLocalNotifications] = useState(notifications);
    const unreadCount = localNotifications.filter((n) => !n.readStatus).length;

    const handleMarkAllAsRead = () => {
        setLocalNotifications((prev) => prev.map((n) => ({ ...n, readStatus: true })));

        router.patch(
            route('notifications.markAllAsRead'),
            {},
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleMarkOneAsRead = (notificationId: string) => {
        setLocalNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, readStatus: true } : n)));

        router.patch(
            route('notifications.markAsRead', notificationId),
            {},
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const getInitials = (name: string) => {
        return name[0].toUpperCase();
    };

    return (
        <Navbar fluid rounded className="border-b border-[#E5E7EB] bg-[#F9FAFB] px-28 py-6">
            <NavbarBrand as={Link} href="/">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" className="mr-3 ml-3 h-7 w-7">
                    <path
                        fill="#039be5"
                        d="M28.967 12H9.442a2 2 0 0 0-1.898 1.368L4 24V10h24a2 2 0 0 0-2-2H15.124a2 2 0 0 1-1.28-.464l-1.288-1.072A2 2 0 0 0 11.276 6H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h22l4.805-11.212A2 2 0 0 0 28.967 12"
                    />
                    <path
                        fill="#b3e5fc"
                        d="M24 16v-2h-3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3v-2h-2v-8Zm8-2v-2h-5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h5v-2h-4V14Zm-16 2h2v8h-2z"
                    />
                </svg>
                <span className="self-center text-2xl font-semibold whitespace-nowrap text-[#101828]">RIFA-WQ</span>
            </NavbarBrand>
            <div className="flex items-center gap-4 md:order-2">
                <Popover
                    aria-labelledby="notifications-popover"
                    content={
                        <NotificationPopover
                            notifications={localNotifications}
                            onMarkAllAsRead={handleMarkAllAsRead}
                            onMarkOneAsRead={handleMarkOneAsRead}
                        />
                    }
                >
                    <Button color="gray" className="relative rounded-none border-0 bg-transparent p-2 enabled:hover:bg-gray-100">
                        <Bell className="h-6 w-6 text-[#4A5565]" />
                        {unreadCount > 0 && (
                            <div className="absolute -top-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </div>
                        )}
                    </Button>
                </Popover>

                {auth.user && (
                    <Dropdown
                        arrowIcon={false}
                        inline
                        label={<Avatar alt="User settings" placeholderInitials={getInitials(auth.user.name)} rounded />}
                    >
                        <DropdownHeader>
                            <span className="mb-0.5 block text-base">{auth.user.name}</span>
                            <span className="block truncate text-sm font-medium">{auth.user.email}</span>
                        </DropdownHeader>
                        <DropdownItem icon={LogOut} onClick={() => router.post(route('logout'))}>
                            Keluar
                        </DropdownItem>
                    </Dropdown>
                )}
            </div>
        </Navbar>
    );
};

export default AppNavbar;
