<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DetailController extends Controller
{
    public function show($id)
    {
        try {
            $details = DB::table('order_details')
                ->join('orders', 'order_details.xo_id', '=', 'orders.id_order')
                ->join('menus', 'order_details.id_menu', '=', 'menus.id_menu')
                ->join('pelanggan', 'orders.id_pelanggan', '=', 'pelanggan.id_pelanggan')
                ->join('categories', 'menus.id_kategori', '=', 'categories.id')
                ->select(
                    'order_details.id_detail',
                    'order_details.jumlah',
                    'order_details.harga_jual',
                    'menus.menu',
                    'categories.nama as kategori',
                    'pelanggan.pelanggan',
                    'orders.tanggal_order'
                )
                ->where('orders.id_order', $id)
                ->orderBy('order_details.id_detail')
                ->get();

            if ($details->isEmpty()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Order details not found'
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'data' => $details
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch order details',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
