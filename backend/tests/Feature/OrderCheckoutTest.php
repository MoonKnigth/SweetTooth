<?php

use App\Models\User;
use App\Models\Product;
use Illuminate\Support\Facades\Http;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('user can checkout items successfully', function () {
    // Fake the Payment Center response
    Http::fake([
        '*/api/v1/payments' => Http::response([
            'reference' => 'TEST-REF-123',
            'checkout_url' => 'https://payment.example.com/checkout/TEST-REF-123'
        ], 201),
    ]);

    // Create user, category and product
    $user = User::factory()->create();
    $category = \App\Models\Category::create(['name' => 'Test Category', 'slug' => 'test-category']);
    $product = Product::create([
        'name' => 'Test Product',
        'category_id' => $category->id,
        'price' => 100.00,
        'isActive' => true,
    ]);

    // Authenticate user
    $this->actingAs($user, 'api');

    // Send checkout request
    $response = $this->postJson('/api/orders', [
        'items' => [
            [
                'product_id' => $product->id,
                'quantity' => 2,
            ]
        ],
        'total_price' => 200.00
    ]);

    // Assert successful response
    $response->assertStatus(201)
             ->assertJsonStructure([
                 'status',
                 'data' => [
                     'order_id',
                     'checkout_url'
                 ]
             ]);

    // Assert database records
    $this->assertDatabaseHas('orders', [
        'user_id' => $user->id,
        'total_price' => 200.00,
        'status' => 'pending',
    ]);

    $this->assertDatabaseHas('payments', [
        'reference' => 'TEST-REF-123',
        'amount' => 200.00, // stored as decimal
        'status' => 'pending',
    ]);
});
