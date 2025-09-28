<?php

use App\Jobs\DeleteNotifications;
use App\Jobs\GenerateNotifications;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::job(new GenerateNotifications)->dailyAt('06.00');
Schedule::job(new DeleteNotifications)->dailyAt('05.55');
