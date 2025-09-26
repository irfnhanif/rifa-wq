// resources/js/components/NotificationsPopover.tsx
import { Notification } from '@/types/Notification';
import { Button } from 'flowbite-react';
import { CheckCheck } from 'lucide-react';
import React from 'react';

interface NotificationsPopoverProps {
    notifications: Notification[];
    onMarkAllAsRead: () => void;
}

const NotificationsPopover: React.FC<NotificationsPopoverProps> = ({ notifications, onMarkAllAsRead }) => {
    const unreadNotifications = notifications.filter((n) => !n.readStatus);
    const readNotifications = notifications.filter((n) => n.readStatus);

    return (
        <div className="w-80 p-4 text-sm text-[#4A5565]">
            {unreadNotifications.length > 0 && (
                <div className="flex flex-col gap-3">
                    <h3 className="text-base font-medium text-[#4A5565]">Belum Dibaca</h3>
                    <div className="h-0 border-t-2 border-[#E5E7EB]" />
                    {unreadNotifications.map((notification, index) => (
                        <div key={notification.id}>
                            <p className="text-base font-normal text-[#4A5565]">{notification.message}</p>
                            {index < unreadNotifications.length - 1 && <div className="mt-3 h-0 border-t border-[#E5E7EB]" />}
                        </div>
                    ))}
                </div>
            )}

            {readNotifications.length > 0 && (
                <div className={`flex flex-col gap-3 ${unreadNotifications.length > 0 ? 'mt-6' : ''}`}>
                    <div className="flex items-center justify-between">
                        <h3 className="text-base font-medium text-[#4A5565]">Sudah Dibaca</h3>
                        <Button
                            size="xs"
                            color="gray"
                            className="border-0 bg-transparent p-1 enabled:hover:bg-gray-100"
                            onClick={onMarkAllAsRead}
                            title="Tandai semua sebagai sudah dibaca"
                        >
                            <CheckCheck className="h-4 w-4 text-[#6A7282]" />
                        </Button>
                    </div>
                    <div className="h-0 border-t-2 border-[#E5E7EB]" />
                    {readNotifications.map((notification, index) => (
                        <div key={notification.id}>
                            <p className="text-base font-normal text-[#99A1AF]">{notification.message}</p>
                            {index < readNotifications.length - 1 && <div className="mt-3 h-0 border-t border-[#E5E7EB]" />}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotificationsPopover;
