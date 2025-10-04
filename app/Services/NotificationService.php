<?php

namespace App\Services;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationService
{

    public static function retrieveNotifications(Request $request)
    {
        $notificationQuery = $request->user()->role === 'ADMIN' ? Notification::query()->orderBy('admin_read_status', 'asc') : Notification::where('user_id', $request->user()->id)->orderBy('read_status', 'asc');

        return $notificationQuery
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($notification) => [
                'id' => $notification->id,
                'userId' => $notification->user_id,
                'workOrderId' => $notification->work_order_id,
                'message' => $notification->message,
                'readStatus' => $notification->read_status,
                'adminReadStatus' => $notification->admin_read_status,
                'createdAt' => $notification->created_at,
                'updatedAt' => $notification->updated_at,
            ]);
    }
}
