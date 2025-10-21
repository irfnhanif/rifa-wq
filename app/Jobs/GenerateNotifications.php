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
        $workOrders = WorkOrder::whereIn('order_status', ['PENDING', 'IN_PROCESS'])
            ->whereDate('order_deadline', '<=', now()->startOfDay()
            ->toDateString())
            ->orderByDesc('order_deadline')
            ->get();

        foreach ($workOrders as $workOrder) {
            $todayOrDate = $workOrder->order_deadline->isToday() ? 'hari ini' : sprintf('tanggal %s', $workOrder->order_deadline->format('d/m/Y'));
            Notification::create([
                'user_id' => $workOrder->user_id,
                'work_order_id' => $workOrder->id,
                'message' => sprintf('Pekerjaan %s memiliki deadline %s.', $workOrder->order_title, $todayOrDate)
            ]);
        }
    }
}
