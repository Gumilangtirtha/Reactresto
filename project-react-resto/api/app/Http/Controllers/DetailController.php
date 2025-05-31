<?php

namespace App\Http\Controllers;

use App\Models\OrderDetail;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Exception;
use App\Http\Middleware\ValidateRequest;
use App\Http\Middleware\ErrorHandler;

class DetailController extends Controller
{
    /**
     * Display a listing of order details for a specific order.
     */    public function index($orderId)
    {
        try {
            $details = DB::table('order_details')
                ->join('menus', 'order_details.id_menu', '=', 'menus.id')
                ->select(
                    'order_details.*',
                    'menus.menu',
                    'menus.gambar'
                )
                ->where('order_details.id_order', $orderId)
                ->get();

            return response()->json([
                'success' => true,
                'data' => $details
            ]);
        } catch (Exception $e) {
            ErrorHandler::handleException($e);
        }
    }

    /**
     * Add a new detail to an existing order.
     */    public function store(Request $request, $orderId)
    {
        try {
            // Validate detail data
            $validation = ValidateRequest::validate($request->all(), [
                'id_menu' => 'required|integer',
                'jumlah' => 'required|integer|min:1',
                'harga_jual' => 'required|numeric|min:0'
            ]);

            if (!$validation['isValid']) {
                ErrorHandler::handle('Validation failed', 422, $validation['errors']);
            }

            $order = Order::find($orderId);
            if (!$order) {
                ErrorHandler::handle('Order tidak ditemukan', 404);
            }

            DB::beginTransaction();

            // Create detail
            $detail = new OrderDetail();
            $detail->id_order = $orderId;
            $detail->id_menu = $request->id_menu;
            $detail->jumlah = $request->jumlah;
            $detail->harga_jual = $request->harga_jual;
            $detail->save();

            // Update order total
            $subtotal = $request->jumlah * $request->harga_jual;
            $order->total += $subtotal;
            $order->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Detail order berhasil ditambahkan',
                'data' => $detail
            ], 201);
        } catch (Exception $e) {
            DB::rollBack();
            ErrorHandler::handleException($e);
        }
    }

    /**
     * Update the specified order detail.
     */    public function update(Request $request, $orderId, $detailId)
    {
        try {
            // Validate detail data
            $validation = ValidateRequest::validate($request->all(), [
                'jumlah' => 'required|integer|min:1',
                'harga_jual' => 'required|numeric|min:0'
            ]);

            if (!$validation['isValid']) {
                ErrorHandler::handle('Validation failed', 422, $validation['errors']);
            }

            $detail = OrderDetail::where('id_order', $orderId)
                ->where('id_order_detail', $detailId)
                ->first();

            if (!$detail) {
                ErrorHandler::handle('Detail order tidak ditemukan', 404);
            }

            DB::beginTransaction();

            // Calculate old and new subtotals
            $oldSubtotal = $detail->jumlah * $detail->harga_jual;
            $newSubtotal = $request->jumlah * $request->harga_jual;
            
            // Update detail
            $detail->jumlah = $request->jumlah;
            $detail->harga_jual = $request->harga_jual;
            $detail->save();

            // Update order total
            $order = $detail->order;
            $order->total = $order->total - $oldSubtotal + $newSubtotal;
            $order->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Detail order berhasil diperbarui',
                'data' => $detail
            ]);
        } catch (Exception $e) {
            DB::rollBack();
            ErrorHandler::handleException($e);
        }
    }

    /**
     * Remove the specified order detail.
     */    public function destroy($orderId, $detailId)
    {
        try {
            $detail = OrderDetail::where('id_order', $orderId)
                ->where('id_order_detail', $detailId)
                ->first();

            if (!$detail) {
                ErrorHandler::handle('Detail order tidak ditemukan', 404);
            }

            DB::beginTransaction();

            // Calculate subtotal to subtract from order total
            $subtotal = $detail->jumlah * $detail->harga_jual;
            
            // Delete detail
            $detail->delete();

            // Update order total
            $order = Order::find($orderId);
            $order->total -= $subtotal;
            $order->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Detail order berhasil dihapus'
            ]);
        } catch (Exception $e) {
            DB::rollBack();
            ErrorHandler::handleException($e);
        }
    }
}
