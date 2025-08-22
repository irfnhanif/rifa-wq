<?php

namespace App\Http\Controllers;

use App\Models\WorkOrder;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WorkOrderController extends Controller
{

    public function index(Request $request)
    {
        $search = trim((string) $request->query('search', ''));
        $status = strtoupper(preg_replace('/\s+/', '_', $request->query('status', 'all')));
        $column = $request->query('column', 'created_at');
        $direction = $request->query('direction', 'asc');

        $allowedStatus = ['PENDING', 'PROCESSED', 'FINISHED', 'PICKED_UP', 'ALL'];
        $validatedStatus = in_array($status, $allowedStatus, true) ? $status : 'ALL';
        $allowedColumns = ['order_title', 'customer_name', 'created_at'];
        $validatedColumn = in_array($column, $allowedColumns, true) ? $column : 'created_at';
        $validatedDirection = strtolower($direction) === 'asc' ? 'asc' : 'desc';

        $query = WorkOrder::query()->with('user:id,name');

        if ($search !== '') {
            $term = addcslashes($search, '\%_');
            $like = "%{$term}%";

            $query->where(function ($q) use ($like) {
                $q->where('order_title', 'ilike', $like)
                    ->orWhere('customer_name', 'ilike', $like)
                    ->orWhere('whatsapp_number', 'ilike', $like);
            });
        };

        if ($validatedStatus !== 'ALL') {
            $query->where('order_status', $validatedStatus);
        }

        $workOrders = $query
            ->orderBy($validatedColumn, $validatedDirection)
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('work-order/index', ['workOrders' => $workOrders]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|min:2|max:255',
            'whatsapp_number' => 'required|string|regex:/^[+]?[0-9\s\-\(\)]{8,20}$/',
            'order_title' => 'required|string|min:2|max:255',
            'order_description' => 'string|min:2',
            'printing_size' => 'required|max:10',
            'printing_material' => 'required|string|min:2|max:255',
            'order_deadline' => 'required|date|after:today',
        ]);

        $validated['user_id'] = $request->user()->id;

        $workOrder = WorkOrder::create($validated);

        // cspell:disable-next-line
        return redirect()->route('work-orders.index')->with('success', sprintf("Pekerjaan %s berhasil ditambahkan", $workOrder['order_title']));
    }


    // This method is always called by AJAX request (API)
    public function show(string $id)
    {
        $workOrder = WorkOrder::findOrFail($id);

        return response()->json($workOrder);
    }

    public function update(Request $request, string $id)
    {
        $workOrder = WorkOrder::findOrFail($id);

        $validated = $request->validate([
            'customer_name' => 'required|string|min:2|max:255',
            'whatsapp_number' => 'required|string|regex:/^[+]?[0-9\s\-\(\)]{8,20}$/',
            'order_title' => 'required|string|min:2|max:255',
            'order_description' => 'string|min:2',
            'printing_size' => 'required|max:10',
            'printing_material' => 'required|string|min:2|max:255',
            'order_deadline' => 'required|date|after:today',
        ]);

        $workOrder->update($validated);

        // cspell:disable-next-line
        return redirect()->route('work-orders.index')->with('success', sprintf("Pekerjaan %s berhasil diperbarui", $validated['order_title']));
    }

    public function destroy(string $id)
    {
        $workOrder = WorkOrder::findOrFail($id);

        $workOrder->delete();

        // cspell:disable-next-line
        return redirect()->route('work-orders.index')->with('success', sprintf("Pekerjaan %s berhasil dihapus", $workOrder['order_title']));
    }
}
