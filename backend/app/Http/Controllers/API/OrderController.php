<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use App\Services\SweetToothPaymentClient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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

            // 1. คำนวณราคาจาก Database เท่านั้น (ห้ามเชื่อค่าจาก Frontend)
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

            // 2. สร้าง Order (status: pending) — ใช้ auth('api') ตามกฎ JWT
            $order = Order::create([
                'user_id' => auth('api')->user()?->id,
                'total_price' => $totalPrice,
                'status' => 'pending',
            ]);

            foreach ($orderItemsData as $itemData) {
                $order->items()->create($itemData);
            }

            // 3. สร้าง Payment record (status: pending)
            $payment = Payment::create([
                'order_id' => $order->id,
                'amount' => $totalPrice,
                'status' => 'pending',
            ]);

            // 4. เรียก Payment Center เพื่อรับ checkout_url
            $paymentClient = new SweetToothPaymentClient;
            $frontendBaseUrl = rtrim(config('app.frontend_url', 'http://localhost:3000'), '/');
            $returnUrl = $frontendBaseUrl.'/checkout/complete?order_id='.$order->id;

            $paymentResult = $paymentClient->createPayment(
                amountInSatang: (int) round($totalPrice * 100),
                returnUrl: $returnUrl,
            );

            // 5. อัปเดต Payment record ด้วย reference ที่ได้จาก Payment Center
            $payment->update([
                'reference' => $paymentResult['reference'],
            ]);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Order created, redirecting to payment',
                'data' => [
                    'order_id' => $order->id,
                    'checkout_url' => $paymentResult['checkout_url'],
                ],
            ], 201);

        } catch (\DomainException $e) {
            DB::rollBack();
            Log::error('Payment Center error: '.$e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 502);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Order creation failed: '.$e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Something went wrong, please try again later.',
            ], 500);
        }
    }

    public function userOrders(Request $request): JsonResponse
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->with(['items.product', 'latestPayment'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $orders,
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $order = Order::with(['items.product', 'latestPayment'])
            ->find($id);

        if (! $order) {
            return response()->json([
                'status' => 'error',
                'message' => 'Order not found',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $order,
        ]);
    }
}
