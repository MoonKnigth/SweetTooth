<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Services\SweetToothPaymentClient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PaymentWebhookController extends Controller
{
    /**
     * Handle incoming webhook from Payment Center.
     *
     * Validates HMAC signature, updates Payment & Order status accordingly.
     */
    public function handle(Request $request): JsonResponse
    {
        // 1. Capture raw payload and signature header
        $payload = $request->getContent();
        $signature = $request->header('X-Payment-Signature', '');

        // 2. Verify HMAC signature — reject immediately if invalid
        $paymentClient = new SweetToothPaymentClient;

        if (! $paymentClient->verifyCallbackSignature($payload, $signature)) {
            Log::warning('Payment webhook: Invalid signature', [
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Invalid signature',
            ], 401);
        }

        $data = json_decode($payload, true);

        if (! $data || empty($data['reference'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid payload',
            ], 400);
        }

        // 3. Find Payment by reference
        $payment = Payment::where('reference', $data['reference'])->first();

        if (! $payment) {
            Log::warning('Payment webhook: Payment not found', [
                'reference' => $data['reference'],
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Payment not found',
            ], 404);
        }

        // 4. Update Payment status and charge_id
        try {
            DB::beginTransaction();

            $payment->update([
                'status' => $data['status'],
                'charge_id' => $data['omise_charge_id'] ?? null,
            ]);

            // 5. If successful, update Order status to 'paid'
            if ($data['status'] === 'successful') {
                $payment->order()->update(['status' => 'paid']);
            }

            // If failed/expired, update Order to 'cancelled'
            if (in_array($data['status'], ['failed', 'expired'])) {
                $payment->order()->update(['status' => 'cancelled']);
            }

            // If refunded, update Order to 'refunded'
            if ($data['status'] === 'refunded') {
                $payment->order()->update(['status' => 'refunded']);
            }

            DB::commit();

            Log::info('Payment webhook processed', [
                'reference' => $data['reference'],
                'status' => $data['status'],
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Webhook processed',
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Payment webhook processing failed: '.$e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Internal server error',
            ], 500);
        }
    }
}
