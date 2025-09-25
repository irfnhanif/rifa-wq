<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreWorkOrderRequest;
use App\Http\Requests\UpdateWorkOrderRequest;
use App\Models\WorkOrder;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class WorkOrderController extends Controller
{

    public function index(Request $request)
    {
        $search = trim((string) $request->query('search', ''));
        $statusInput = $request->query('status');
        $column = $request->query('column', 'order_deadline');
        $direction = $request->query('direction', 'asc');

        if (!is_array($statusInput)) {
            $statusInput = [$statusInput];
        }

        $allowedStatus = ['PENDING', 'IN_PROCESS', 'FINISHED', 'PICKED_UP',];
        $validatedStatus = array_values(array_filter($statusInput, function ($status) use ($allowedStatus) {
            return is_string($status) && in_array($status, $allowedStatus, true);
        }));

        $allowedColumns = ['order_title', 'customer_name', 'created_at', 'order_deadline', 'order_status'];
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
        }

        if (count($validatedStatus) > 0) {
            $query->whereIn('order_status', $validatedStatus);
        }

        $workOrders = $query
            ->orderBy($validatedColumn, $validatedDirection)
            ->paginate(10)
            ->withQueryString();

        $workOrders->getCollection()->transform(function (WorkOrder $workOrder) {
            return [
                'id' => $workOrder->id,
                'customerName' => $workOrder->customer_name,
                'whatsappNumber' => $workOrder->whatsapp_number,
                'orderTitle' => $workOrder->order_title,
                'orderDescription' => $workOrder->order_description,
                'printingSize' => $workOrder->printing_size,
                'printingMaterial' => $workOrder->printing_material,
                'orderDeadline' => $workOrder->order_deadline,
                'orderStatus' => $workOrder->order_status,
                'orderCost' => $workOrder->order_cost,
                'createdAt' => $workOrder->created_at,
                'updatedAt' => $workOrder->updated_at,
                'user' => $workOrder->user ? ['id' => $workOrder->user->id, 'name' => $workOrder->user->name] : null,
            ];
        });

        $queueCount = WorkOrder::whereIn('order_status', ['FINISHED', 'PICKED_UP'])->whereDate('updated_at', now())->count();
        $dailyRevenue = WorkOrder::whereIn('order_status', ['FINISHED', 'PICKED_UP'])->whereDate('updated_at', now())->sum('order_cost');
        $formattedDailyRevenue = 'Rp' . number_format($dailyRevenue, 0, ',', '.');

        return Inertia::render('WorkOrder/Index', [
            'stats' => [
                'queueCount' => $queueCount,
                'dailyRevenue' => $formattedDailyRevenue
            ],
            'workOrders' => $workOrders,
            'filters' => [
                'search' => $search,
                'status' => $validatedStatus,
                'column' => $validatedColumn,
                'direction' => $validatedDirection,
            ]
        ]);
    }

    public function store(StoreWorkOrderRequest $request)
    {
        try {
            $validated = $request->validated();

            $validated['user_id'] = $request->user()->id;

            $workOrder = WorkOrder::create($validated);

            return redirect()->route('work-orders.index')->with('success', sprintf("Pekerjaan %s berhasil ditambahkan", $workOrder['order_title']));
        } catch (ValidationException $e) {
            throw $e;
        }
    }

    // This method is always called by AJAX request (API)
    public function show(string $id)
    {
        $workOrder = WorkOrder::findOrFail($id);

        return response()->json($workOrder);
    }

    public function update(UpdateWorkOrderRequest $request, string $id)
    {
        try {
            $workOrder = WorkOrder::findOrFail($id);

            $validated = $request->validated();

            if (!in_array($validated['order_status'], ['FINISHED', 'PICKED_UP']) && $workOrder['order_cost'] !== null) {
                $validated['order_cost'] = null;
            }

            $workOrder->update($validated);

            return redirect()->route('work-orders.index')->with('success', sprintf("Pekerjaan %s berhasil diperbarui", $validated['order_title']));
        } catch (ValidationException $e) {
            throw $e;
        }
    }

    public function markAsDone(Request $request, string $id)
    {
        try {
            $workOrder = WorkOrder::findOrFail($id);

            $validated = $request->validate(
                [
                    'order_cost' => 'nullable|integer|min:0'
                ]
            );

            $statusMessage = '';
            switch ($workOrder['order_status']) {
                case 'PENDING':
                    $workOrder->update(['order_status' => 'IN_PROCESS']);
                    $statusMessage = 'dimulai';
                    break;
                case 'IN_PROCESS':
                    $workOrder->update([
                        'order_status' => 'FINISHED',
                        'order_cost' => $validated['order_cost']
                    ]);
                    $statusMessage = 'diselesaikan';
                    break;
                case 'FINISHED':
                    $workOrder->update(['order_status' => 'PICKED_UP']);
                    $statusMessage = 'diambil';
                    break;
                default:
                    throw new \InvalidArgumentException('Invalid order status transition');
            }

            return redirect()->route('work-orders.index')->with('success', sprintf("Pekerjaan %s berhasil %s", $workOrder['order_title'], $statusMessage));
        } catch (\Throwable $th) {
            Log::error($th);
            return redirect()->route('work-orders.index')->with('error', 'Terjadi kesalahan saat memperbarui pekerjaan');
        }
    }

    public function destroy(string $id)
    {
        try {
            $workOrder = WorkOrder::findOrFail($id);

            $workOrder->delete();

            return redirect()->route('work-orders.index')->with('success', sprintf("Pekerjaan %s berhasil dihapus", $workOrder['order_title']));
        } catch (\Throwable $th) {
            Log::error($th);
            return redirect()->route('work-orders.index')->with('error', 'Terjadi kesalahan saat memperbarui pekerjaan');
        }
    }
}
