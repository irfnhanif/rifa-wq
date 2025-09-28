<?php

namespace App\Jobs;

use App\Models\Notification;
use Carbon\Carbon;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class DeleteNotifications implements ShouldQueue
{
    use Queueable;

    protected $signature = 'job:delete-notifications';
    protected $description = 'Delete notifications older than 30 days';

    public function handle(): void
    {
        $thirtyDaysAgo = Carbon::today()->subDays(30);

        $notifications = Notification::whereDate('created_at', '>=', $thirtyDaysAgo);

        $notifications->delete();
    }
}
