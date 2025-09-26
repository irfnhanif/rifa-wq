<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\WorkOrder;
use Carbon\Carbon;

class NotificationService
{
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

    public function deleteNotification() {
        $thirtyDaysAgo = Carbon::today()->subDays(30);

        $notifications = Notification::whereDate('created_at', '>=', $thirtyDaysAgo);

        $notifications->delete();
    }
}
