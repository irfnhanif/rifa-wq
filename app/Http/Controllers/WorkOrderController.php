<?php

namespace App\Http\Controllers;

use App\Models\WorkOrder;
use Illuminate\Http\Request;

class WorkOrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
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

        $query = WorkOrder::query()->with('user');

        if ($search !== '') {
            $term = addcslashes($search, '\%_');
            $like = "%{$term}%";

            $query->where(function ($q) use ($like) {
                $q->where('order_title', 'ilike', $like)
                    ->orWhere('customer_name', 'ilike', $like)
                    ->orWhere('whatsapp_number', 'ilike', $like);
            });
        };

        if ($status !== 'ALL') {
            $query->where('order_status', $validatedStatus);
        }

        $workOrders = $query
            ->orderBy($validatedColumn, $validatedDirection)
            ->paginate(10)
            ->withQueryString();
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
