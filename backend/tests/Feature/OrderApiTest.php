<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Product;
use App\Models\Category;
use App\Models\User;

class OrderApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_create_order()
    {
        $category = Category::create(['name' => 'Dessert', 'slug' => 'dessert']);
        $product = Product::create([
            'name' => 'Waffle',
            'category_id' => $category->id,
            'price' => 5.00,
            'isActive' => true
        ]);

        $response = $this->postJson('/api/orders', [
            'user_id' => null,
            'items' => [
                [
                    'product_id' => $product->id,
                    'quantity' => 2,
                    'price' => 5.00
                ]
            ]
        ]);

        $response->assertStatus(200);
        
        $this->assertDatabaseHas('orders', [
            'user_id' => null,
            'total_price' => 10.00,
            'status' => 'completed'
        ]);
        
        $this->assertDatabaseHas('order_items', [
            'product_id' => $product->id,
            'quantity' => 2,
            'price_at_time' => 5.00
        ]);
    }
    
    public function test_user_can_create_order()
    {
        $user = User::factory()->create();
        $category = Category::create(['name' => 'Dessert', 'slug' => 'dessert']);
        $product = Product::create([
            'name' => 'Waffle',
            'category_id' => $category->id,
            'price' => 5.00,
            'isActive' => true
        ]);

        $response = $this->postJson('/api/orders', [
            'user_id' => $user->id,
            'items' => [
                [
                    'product_id' => $product->id,
                    'quantity' => 1,
                    'price' => 5.00
                ]
            ]
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('orders', [
            'user_id' => $user->id,
            'total_price' => 5.00,
            'status' => 'completed'
        ]);
    }
}
