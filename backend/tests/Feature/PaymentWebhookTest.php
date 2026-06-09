<?php

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Generate webhook secret for testing
    config(['services.payment_center.webhook_secret' => 'test-secret']);
});

test('webhook handles successful payment correctly', function () {
    $order = Order::create([
        'user_id' => null,
        'total_price' => 100.00,
        'status' => 'pending',
    ]);

    $payment = Payment::create([
        'order_id' => $order->id,
        'reference' => 'TEST-REF-SUCCESS',
        'amount' => 10000,
        'status' => 'pending',
    ]);

    $payload = json_encode([
        'reference' => 'TEST-REF-SUCCESS',
        'status' => 'successful',
        'omise_charge_id' => 'chrg_test_123'
    ]);

    $signature = hash_hmac('sha256', $payload, 'test-secret');

    $response = $this->call('POST', '/api/webhooks/payment-center', [], [], [], [
        'HTTP_X-Payment-Signature' => $signature,
        'CONTENT_TYPE' => 'application/json',
    ], $payload);

    $response->assertStatus(200)
             ->assertJson(['status' => 'success']);

    $this->assertDatabaseHas('payments', [
        'id' => $payment->id,
        'status' => 'successful',
        'charge_id' => 'chrg_test_123',
    ]);

    $this->assertDatabaseHas('orders', [
        'id' => $order->id,
        'status' => 'paid',
    ]);
});

test('webhook handles refunded payment correctly', function () {
    $order = Order::create([
        'user_id' => null,
        'total_price' => 100.00,
        'status' => 'paid',
    ]);

    $payment = Payment::create([
        'order_id' => $order->id,
        'reference' => 'TEST-REF-REFUND',
        'amount' => 10000,
        'status' => 'successful',
    ]);

    $payload = json_encode([
        'reference' => 'TEST-REF-REFUND',
        'status' => 'refunded'
    ]);

    $signature = hash_hmac('sha256', $payload, 'test-secret');

    // Need to use call directly to pass raw content for accurate payload
    $response = $this->call('POST', '/api/webhooks/payment-center', [], [], [], [
        'HTTP_X-Payment-Signature' => $signature,
        'CONTENT_TYPE' => 'application/json',
    ], $payload);

    $response->assertStatus(200)
             ->assertJson(['status' => 'success']);

    $this->assertDatabaseHas('payments', [
        'id' => $payment->id,
        'status' => 'refunded',
    ]);

    $this->assertDatabaseHas('orders', [
        'id' => $order->id,
        'status' => 'refunded', // as implemented in webhook
    ]);
});

test('webhook rejects invalid signature', function () {
    $payload = json_encode([
        'reference' => 'TEST-REF-123',
        'status' => 'successful',
    ]);

    $response = $this->call('POST', '/api/webhooks/payment-center', [], [], [], [
        'HTTP_X-Payment-Signature' => 'invalid-signature',
        'CONTENT_TYPE' => 'application/json',
    ], $payload);

    $response->assertStatus(401)
             ->assertJson(['message' => 'Invalid signature']);
});
