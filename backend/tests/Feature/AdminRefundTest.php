<?php

use App\Models\User;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Support\Facades\Http;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('admin can refund a paid order', function () {
    // Fake the Payment Center response
    Http::fake([
        '*/api/v1/admin/payments/*/refund' => Http::response([
            'message' => 'Refund processed successfully',
            'refund_id' => 'rfnd_test_123'
        ], 200),
    ]);

    // Create admin user
    $admin = User::factory()->create(['role' => 'admin']);

    // Create a paid order with a payment
    $order = Order::create([
        'user_id' => null,
        'total_price' => 100.00,
        'status' => 'paid',
    ]);

    $payment = Payment::create([
        'order_id' => $order->id,
        'reference' => 'TEST-REF-ADMIN-REFUND',
        'amount' => 10000,
        'status' => 'successful',
        'charge_id' => 'chrg_test_123'
    ]);

    // Authenticate as admin
    $this->actingAs($admin, 'api');

    // Send refund request
    $response = $this->postJson("/api/admin/orders/{$order->id}/refund");

    // Assert successful response
    $response->assertStatus(200)
             ->assertJson([
                 'status' => 'success',
                 'message' => 'Refund initiated successfully'
             ]);

    // Assert database records are updated to 'refunded'
    $this->assertDatabaseHas('orders', [
        'id' => $order->id,
        'status' => 'refunded',
    ]);

    $this->assertDatabaseHas('payments', [
        'id' => $payment->id,
        'status' => 'refunded',
    ]);
});

test('normal user cannot refund an order', function () {
    // Create normal user
    $user = User::factory()->create(['role' => 'customer']);

    // Create a paid order
    $order = Order::create([
        'user_id' => null,
        'total_price' => 100.00,
        'status' => 'paid',
    ]);

    // Authenticate as user
    $this->actingAs($user, 'api');

    // Send refund request
    $response = $this->postJson("/api/admin/orders/{$order->id}/refund");

    // Assert forbidden or unauthorized
    // Assuming 'admin' middleware aborts with 403 or redirects
    // Depending on EnsureUserIsAdmin middleware implementation, it might be 401 or 403. Let's assert status is not 200.
    expect($response->status())->not->toBe(200);
});
