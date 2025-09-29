import { Notification } from '@/types/Notification';
import { Button } from 'flowbite-react';
import { Bell, CheckCheck } from 'lucide-react';
import React from 'react';

interface NotificationsPopoverProps {
    notifications: Notification[];
    onMarkAllAsRead: () => void;
    onMarkOneAsRead: (notificationId: string) => void;
}

const NotificationsPopover: React.FC<NotificationsPopoverProps> = ({ notifications, onMarkAllAsRead, onMarkOneAsRead }) => {
    const unreadNotifications = notifications.filter((n) => !n.readStatus);
    const readNotifications = notifications.filter((n) => n.readStatus);

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.readStatus) {
            onMarkOneAsRead(notification.id);
        }
    };

    return (
        <div className="w-80 p-4 text-sm text-[#4A5565]">
            {unreadNotifications.length > 0 && (
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-base font-medium text-[#4A5565]">Notifikasi ({unreadNotifications.length})</h3>
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
            )}

            {unreadNotifications.length > 0 && (
                <div className="flex flex-col gap-2">
                    <h4 className="text-sm font-medium text-[#4A5565]">Belum Dibaca</h4>
                    <div className="h-0 border-t-2 border-[#E5E7EB]" />
                    {unreadNotifications.map((notification, index) => (
                        <div key={notification.id}>
                            <div
                                className="cursor-pointer rounded-md p-2 transition-colors hover:border-l-4 hover:border-blue-500 hover:bg-blue-50"
                                onClick={() => handleNotificationClick(notification)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        handleNotificationClick(notification);
                                    }
                                }}
                            >
                                <div className="flex items-start gap-2">
                                    <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-600"></div>
                                    <p className="text-sm leading-relaxed font-medium text-[#4A5565]">{notification.message}</p>
                                </div>
                                <p className="mt-1 ml-4 text-xs text-[#6A7282]">
                                    {new Date(notification.createdAt).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'short',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>
                            {index < unreadNotifications.length - 1 && <div className="mt-2 h-0 border-t border-[#E5E7EB]" />}
                        </div>
                    ))}
                </div>
            )}

            {readNotifications.length > 0 && (
                <div className={`flex flex-col gap-2 ${unreadNotifications.length > 0 ? 'mt-6' : ''}`}>
                    <h4 className="text-sm font-medium text-[#4A5565]">Sudah Dibaca</h4>
                    <div className="h-0 border-t-2 border-[#E5E7EB]" />
                    {readNotifications.slice(0, 3).map((notification, index) => (
                        <div key={notification.id}>
                            <div className="rounded-md p-2 opacity-60">
                                <p className="text-sm leading-relaxed font-normal text-[#99A1AF]">{notification.message}</p>
                                <p className="mt-1 text-xs text-[#9CA3AF]">
                                    {new Date(notification.createdAt).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'short',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>
                            {index < Math.min(readNotifications.length - 1, 2) && <div className="mt-2 h-0 border-t border-[#E5E7EB]" />}
                        </div>
                    ))}
                    {readNotifications.length > 3 && (
                        <p className="mt-2 text-center text-xs text-[#6A7282]">dan {readNotifications.length - 3} notifikasi lainnya...</p>
                    )}
                </div>
            )}

            {notifications.length === 0 && (
                <div className="py-8 text-center">
                    <Bell className="mx-auto mb-4 h-12 w-12 text-[#E5E7EB]" />
                    <p className="text-sm text-[#6A7282]">Tidak ada notifikasi</p>
                </div>
            )}
        </div>
    );
};

export default NotificationsPopover;
