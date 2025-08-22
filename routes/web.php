<?php

use App\Http\Controllers\WorkOrderController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::get('/work-orders', [WorkOrderController::class, 'index'])->name('work-orders.index');
Route::get('/work-orders/{id}', [WorkOrderController::class, 'show'])->name('work-orders.show');
Route::post('/work-orders', [WorkOrderController::class, 'store'])->name('work-orders.store');
Route::put('/work-orders/{id}', [WorkOrderController::class, 'update'])->name('work-orders.update');
Route::delete('/work-orders/{id}', [WorkOrderController::class, 'destroy'])->name('work-orders.destroy');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
