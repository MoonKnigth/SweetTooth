<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\JsonResponse;

class OrderController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        try {
            DB::beginTransaction();

            $totalPrice = 0;
            $orderItemsData = [];

            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);
                $subTotal = $product->price * $item['quantity'];
                $totalPrice += $subTotal;

                $orderItemsData[] = [
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price_at_time' => $product->price,
                ];
            }

            $order = Order::create([
                'user_id' => $request->user()?->id,
                'total_price' => $totalPrice,
                'status' => 'pending'
            ]);

            foreach ($orderItemsData as $itemData) {
                $order->items()->create($itemData);
            }

            $order->update(['status' => 'completed']);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Order confirmed successfully',
                'data' => [
                    'orderId' => 'ord_' . substr($order->id, 0, 8),
                    'status' => 'paid',
                ]
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Order creation failed: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Something went wrong, please try again later.'
            ], 500);
        }
    }

    public function userOrders(Request $request): JsonResponse
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->with(['items.product'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $orders
        ]);
    }

    public function show($id): JsonResponse
    {
        $realId = str_replace(['ord_', '%', '_'], '', $id);

        if (strlen($realId) < 8) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid order ID format'
            ], 400);
        }
        
        $order = Order::with(['items.product'])
            ->where('id', 'LIKE', $realId . '%')
            ->first();

        if (!$order) {
            return response()->json([
                'status' => 'error',
                'message' => 'Order not found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $order
        ]);
    }
}
