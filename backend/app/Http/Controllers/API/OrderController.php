<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
                'user_id' => $request->user_id ?? null,
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
                    'orderId' => 'ord_' . str_pad($order->id, 5, '0', STR_PAD_LEFT),
                    'status' => 'paid',
                ]
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Something went wrong: ' . $e->getMessage()
            ], 500);
        }
    }
}
