<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SweetToothPaymentClient
{
    private string $baseUrl;

    private string $accessKey;

    private string $secretKey;

    private string $webhookSecret;

    public function __construct()
    {
        $this->baseUrl = rtrim(config('services.payment_center.base_url'), '/');
        $this->accessKey = config('services.payment_center.access_key');
        $this->secretKey = config('services.payment_center.secret_key');
        $this->webhookSecret = config('services.payment_center.webhook_secret');
    }

    /**
     * Create a payment in the Payment Center.
     *
     * @param  int  $amountInSatang  Minimum 2000 (20.00 THB) for Omise
     * @param  string  $returnUrl  URL to redirect user back to after payment
     * @return array{reference: string, checkout_url: string}
     *
     * @throws \RuntimeException
     */
    public function createPayment(int $amountInSatang, string $returnUrl): array
    {
        try {
            $response = Http::timeout(10)->withHeaders([
                'X-Access-Key' => $this->accessKey,
                'X-Secret-Key' => $this->secretKey,
            ])->post("{$this->baseUrl}/api/v1/payments", [
                'amount' => $amountInSatang,
                'currency' => 'THB',
                'return_url' => $returnUrl,
            ]);

            if ($response->status() !== 201) {
                Log::error('Payment Center: Failed to create payment', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                throw new \DomainException(
                    'Failed to create payment: '.($response->json('message') ?? 'Unknown error')
                );
            }

            $responseData = $response->json();

            // Fix for ChromeOS/WSL: If the checkout URL uses the Docker Gateway IP,
            // replace it with localhost so the host browser can access it.
            if (isset($responseData['checkout_url'])) {
                $responseData['checkout_url'] = str_replace(
                    'http://172.20.0.1:8005',
                    'http://localhost:8005',
                    $responseData['checkout_url']
                );
            }

            return $responseData;

        } catch (ConnectionException $e) {
            Log::error('Payment Center Connection Error: '.$e->getMessage());
            throw new \DomainException('Could not connect to Payment Center. Is it running?');
        }
    }

    /**
     * Verify the HMAC-SHA256 signature of a received Webhook/Callback payload.
     *
     * @param  string  $payload  The raw JSON string received from Payment Center
     * @param  string  $signature  The value from the X-Payment-Signature header
     * @return bool True if signature is valid, false otherwise
     */
    public function verifyCallbackSignature(string $payload, string $signature): bool
    {
        if (empty($signature) || empty($this->webhookSecret)) {
            return false;
        }

        $expectedSignature = hash_hmac('sha256', $payload, $this->webhookSecret);

        return hash_equals($expectedSignature, $signature);
    }
}
