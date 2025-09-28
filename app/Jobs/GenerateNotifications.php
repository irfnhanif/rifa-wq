<?php

namespace App\Jobs;

use App\Models\Notification;
use App\Models\WorkOrder;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class GenerateNotifications implements ShouldQueue
{
    use Queueable;

    protected $signature = 'job:generate-notifications';
    protected $description = 'Generate notifications for work orders that have deadlines today';

    public function handle(): void
    {
        $workOrders = WorkOrder::whereDate('order_deadline', now())->get();

        foreach ($workOrders as $workOrder) {
            Notification::create([
                'user_id' => $workOrder['user_id'],
                'work_order_id' => $workOrder['id'],
                'message' => sprintf('Pekerjaan %s memiliki deadline hari ini.', $workOrder['order_title']),
                'read_status' => false
            ]);
        }
    }
}
