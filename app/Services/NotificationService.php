<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\WorkOrder;
use Carbon\Carbon;
use Illuminate\Http\Request;

class NotificationService
{

    public static function retrieveNotifications(Request $request)
    {
        return Notification::where('user_id', $request->user()->id)
            ->orderBy('read_status', 'asc')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($notification) => [
                'id' => $notification->id,
                'userId' => $notification->user_id,
                'workOrderId' => $notification->work_order_id,
                'message' => $notification->message,
                'readStatus' => $notification->read_status,
                'createdAt' => $notification->created_at,
                'updatedAt' => $notification->updated_at,
            ]);
    }

    public function generateNotification()
    {
        $workOrders = WorkOrder::whereDate('order_deadline', now())->get();

        foreach ($workOrders as $workOrder) {
            Notification::create([
                'user_id' => $workOrder['user_id'],
                'work_order_id' => $workOrder['id'],
                'message' => sprintf('Pekerjaan %s memiliki tenggat waktu hari ini, %s.', $workOrder['order_title'], $workOrder['order_deadline']->format('d F Y')),
                'read_status' => false
            ]);
        }
    }

    public function deleteNotification()
    {
        $thirtyDaysAgo = Carbon::today()->subDays(30);

        $notifications = Notification::whereDate('created_at', '>=', $thirtyDaysAgo);

        $notifications->delete();
    }
}
