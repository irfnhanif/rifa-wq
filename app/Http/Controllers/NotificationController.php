<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function markAllAsRead()
    {
        Notification::where('read_status', false)->update(['read_status' => true]);

        return redirect()->route('work-orders.index');
    }

    public function markAsRead(string $id)
    {
        Notification::findOrFail($id)->update(['read_status' => true]);

        return redirect()->route('work-orders.index');
    }
}
