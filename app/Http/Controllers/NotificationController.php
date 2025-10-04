<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function markAllAsRead(Request $request)
    {
        if ($request->user()->role === 'ADMIN') {
            Notification::where('admin_read_status', false)->update(['admin_read_status' => true]);
        } else {
            Notification::where('read_status', false)->update(['read_status' => true]);
        }

        return redirect()->route('work-orders.index');
    }

    public function markAsRead(Request $request, string $id)
    {
        if ($request->user()->role === 'ADMIN') {
            Notification::findOrFail($id)->update(['admin_read_status' => true]);
        } else {
            Notification::findOrFail($id)->update(['read_status' => true]);
        }

        return redirect()->route('work-orders.index');
    }
}
