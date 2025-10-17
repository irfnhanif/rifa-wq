<?php

use App\Jobs\DeleteNotifications;
use App\Jobs\DeleteWorkOrders;
use App\Jobs\GenerateNotifications;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schedule;

Schedule::job(new DeleteNotifications)->dailyAt('04:55');
Schedule::job(new DeleteWorkOrders)->dailyAt('04:55');
Schedule::job(new GenerateNotifications)->dailyAt('05:00');

// temp
Schedule::job(new GenerateNotifications)->dailyAt('07:38')
->before(fn() => Log::info('GenerateNotifications job starting'))
    ->onSuccess(fn() => Log::info('GenerateNotifications job completed'))
    ->onFailure(fn() => Log::error('GenerateNotifications job failed'));
