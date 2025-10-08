<?php

namespace App\Jobs;

use App\Models\WorkOrder;
use Carbon\Carbon;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class DeleteWorkOrders implements ShouldQueue
{
    use Queueable;

    protected $signature = 'job:delete-work-orders';
    protected $description = 'Delete work orders older than 30 days';

    public function handle(): void
    {
        $thirtyDaysAgo = Carbon::today()->subDays(30);
        WorkOrder::where('created_at', '<=', $thirtyDaysAgo)->forceDelete();
    }
}
