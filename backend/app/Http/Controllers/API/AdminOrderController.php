<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminOrderController extends Controller
{
    /**
     * Get all orders for admin.
     */
    public function index(): JsonResponse
    {
        // Get all orders with the associated user, ordered by creation date descending
        $orders = Order::with('user')->orderBy('created_at', 'desc')->get();

        return response()->json([
            'status' => 'success',
            'data' => $orders,
        ]);
    }

    /**
     * Update order status.
     */
    public function updateStatus(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'status' => 'required|string|in:pending,paid,completed,cancelled',
        ]);

        $order = Order::find($id);

        if (! $order) {
            return response()->json([
                'status' => 'error',
                'message' => 'Order not found',
            ], 404);
        }

        $order->status = $request->status;
        $order->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Order status updated successfully',
            'data' => $order,
        ]);
    }

    /**
     * Refund order payment via Payment Center.
     */
    public function refund(string $id): JsonResponse
    {
        $order = Order::with('latestPayment')->find($id);

        if (! $order) {
            return response()->json([
                'status' => 'error',
                'message' => 'Order not found',
            ], 404);
        }

        if ($order->status !== 'paid' || ! $order->latestPayment) {
            return response()->json([
                'status' => 'error',
                'message' => 'Order is not paid or has no payment record',
            ], 400);
        }

        try {
            $paymentClient = new \App\Services\SweetToothPaymentClient();
            $response = $paymentClient->refundPayment($order->latestPayment->reference);

            // If success, update status to refunding or refunded
            // Actual refunded status should be confirmed by webhook ideally, 
            // but we can set it to refunding here. Let's just set it to 'refunded' as per simple workflow.
            $order->status = 'refunded';
            $order->save();

            $order->latestPayment->status = 'refunded';
            $order->latestPayment->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Refund initiated successfully',
                'data' => $response,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
