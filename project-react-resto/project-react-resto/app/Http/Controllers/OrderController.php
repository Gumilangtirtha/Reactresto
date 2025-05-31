<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\OrderFilterRequest;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = DB::table('orders')
            ->join('pelanggan', 'orders.id_pelanggan', '=', 'pelanggan.id_pelanggan')
            ->select('orders.*', 'pelanggan.pelanggan');

        // Apply date filters if provided
        if ($request->has(['start_date', 'end_date'])) {
            $query->whereDate('orders.tanggal_order', '>=', $request->start_date)
                  ->whereDate('orders.tanggal_order', '<=', $request->end_date);
        }

        $query->orderBy('orders.status', 'asc');

        return response()->json([
            'status' => 'success',
            'data' => $query->get()
        ]);
    }
}