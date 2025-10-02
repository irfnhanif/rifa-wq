<?php

use App\Http\Controllers\NotificationController;
use App\Http\Controllers\WorkOrderController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/', function () {
        return redirect()->route('work-orders.index');
    })->name('home');

    Route::get('/work-orders', [WorkOrderController::class, 'index'])->name('work-orders.index');
    Route::get('/work-orders/{id}', [WorkOrderController::class, 'show'])->name('work-orders.show');

    Route::middleware('role:USER')->group(function() {
        Route::post('/work-orders', [WorkOrderController::class, 'store'])->name('work-orders.store');
        Route::put('/work-orders/{id}', [WorkOrderController::class, 'update'])->name('work-orders.update');
        Route::patch('/work-orders/{id}', [WorkOrderController::class, 'markAsDone'])->name('work-orders.markAsDone');
        Route::delete('/work-orders/{id}', [WorkOrderController::class, 'destroy'])->name('work-orders.destroy');
    });

    Route::patch('/notifications', [NotificationController::class, 'markAllAsRead'])->name('notifications.markAllAsRead');
    Route::patch('/notifications/{id}', [NotificationController::class, 'markAsRead'])->name('notifications.markAsRead');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
