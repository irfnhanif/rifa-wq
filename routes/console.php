<?php

use App\Jobs\DeleteNotifications;
use App\Jobs\DeleteWorkOrders;
use App\Jobs\GenerateNotifications;
use Illuminate\Support\Facades\Schedule;

Schedule::job(new DeleteNotifications)->dailyAt('04:55');
Schedule::job(new DeleteWorkOrders)->dailyAt('04:55');
Schedule::job(new GenerateNotifications)->dailyAt('05:00');

// temp
Schedule::job(new GenerateNotifications)->dailyAt('07:30');
