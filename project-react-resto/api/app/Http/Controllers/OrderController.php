<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Exception;
use App\Http\Middleware\ValidateRequest;
use App\Http\Middleware\ErrorHandler;

class OrderController extends Controller
{
    /**
     * Display a listing of all orders with customer details.
     */
    public function index()
    {
        try {
            $orders = DB::table('orders')
                ->join('pelanggans', 'orders.id_pelanggan', '=', 'pelanggans.id')
                ->select(
                    'orders.*',
                    'pelanggans.nama as pelanggan',
                    'pelanggans.alamat',
                    'pelanggans.telp'
                )
                ->orderBy('orders.tanggal_order', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $orders
            ]);
        } catch (Exception $e) {
            ErrorHandler::handleException($e);
        }
    }

    /**
     * Display the specified order with details.
     */    public function show($id)
    {
        try {
            // Get order data with customer details
            $order = DB::table('orders')
                ->join('pelanggans', 'orders.id_pelanggan', '=', 'pelanggans.id')
                ->select(
                    'orders.*',
                    'pelanggans.nama as pelanggan',
                    'pelanggans.alamat',
                    'pelanggans.telp'
                )
                ->where('orders.id_order', $id)
                ->first();

            if (!$order) {
                ErrorHandler::handle('Order tidak ditemukan', 404);
            }

            // Get order details with menu information
            $details = DB::table('order_details')
                ->join('menus', 'order_details.id_menu', '=', 'menus.id')
                ->select(
                    'order_details.*',
                    'menus.menu',
                    'menus.gambar'
                )
                ->where('order_details.id_order', $id)
                ->get();

            $order->details = $details;

            return response()->json([
                'success' => true,
                'data' => $order
            ]);
        } catch (Exception $e) {
            ErrorHandler::handleException($e);
        }
    }

    /**
     * Create a new order with details.
     */    public function store(Request $request)
    {
        try {
            // Validate main order data
            $validation = ValidateRequest::validate($request->all(), [
                'id_pelanggan' => 'required|integer',
                'tanggal_order' => 'required|date',
                'details' => 'required|array',
                'details.*.id_menu' => 'required|integer',
                'details.*.jumlah' => 'required|integer|min:1',
                'details.*.harga_jual' => 'required|numeric|min:0'
            ]);

            if (!$validation['isValid']) {
                ErrorHandler::handle('Validation failed', 422, $validation['errors']);
            }

            DB::beginTransaction();

            // Create order
            $order = new Order();
            $order->id_pelanggan = $request->id_pelanggan;
            $order->tanggal_order = $request->tanggal_order;
            $order->status = 0; // Default status
            $order->save();

            // Create order details and calculate total
            $total = 0;
            foreach ($request->details as $detail) {
                $orderDetail = new OrderDetail();
                $orderDetail->id_order = $order->id_order;
                $orderDetail->id_menu = $detail['id_menu'];
                $orderDetail->jumlah = $detail['jumlah'];
                $orderDetail->harga_jual = $detail['harga_jual'];
                $orderDetail->save();

                $total += $detail['jumlah'] * $detail['harga_jual'];
            }

            // Update order total
            $order->total = $total;
            $order->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Order berhasil dibuat',
                'data' => $order
            ], 201);
        } catch (Exception $e) {
            DB::rollBack();
            ErrorHandler::handleException($e);
        }
    }

    /**
     * Update order status and payment info.
     */    public function update(Request $request, $id)
    {
        try {
            // Validate update data
            $validation = ValidateRequest::validate($request->all(), [
                'status' => 'required|integer|min:0|max:3',
                'bayar' => 'required_if:status,1|numeric|min:0',
                'kembali' => 'required_if:status,1|numeric|min:0'
            ]);

            if (!$validation['isValid']) {
                ErrorHandler::handle('Validation failed', 422, $validation['errors']);
            }

            $order = Order::find($id);
            if (!$order) {
                ErrorHandler::handle('Order tidak ditemukan', 404);
            }

            // Update order
            $order->status = $request->status;
            if ($request->status == 1) { // If status is "paid"
                $order->bayar = $request->bayar;
                $order->kembali = $request->kembali;
            }
            $order->save();

            return response()->json([
                'success' => true,
                'message' => 'Status order berhasil diperbarui',
                'data' => $order
            ]);
        } catch (Exception $e) {
            ErrorHandler::handleException($e);
        }
    }
}
