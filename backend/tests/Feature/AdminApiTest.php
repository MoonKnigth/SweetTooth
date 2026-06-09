<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_product()
    {
        /** @var \Illuminate\Contracts\Auth\Authenticatable $admin */
        $admin = User::factory()->create(['role' => 'admin']);
        $this->actingAs($admin, 'api');

        $category = Category::create(['name' => 'Dessert', 'slug' => 'dessert']);

        $response = $this->postJson('/api/admin/products', [
            'name' => 'New Awesome Product',
            'category_id' => $category->id,
            'price' => 10.00,
            'isActive' => true,
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('products', [
            'name' => 'New Awesome Product',
            'price' => 10.00,
        ]);
    }

    public function test_customer_cannot_create_product()
    {
        /** @var \Illuminate\Contracts\Auth\Authenticatable $customer */
        $customer = User::factory()->create(['role' => 'customer']);
        $this->actingAs($customer, 'api');

        $category = Category::create(['name' => 'Dessert', 'slug' => 'dessert']);

        $response = $this->postJson('/api/admin/products', [
            'name' => 'New Awesome Product',
            'category_id' => $category->id,
            'price' => 10.00,
            'isActive' => true,
        ]);

        $response->assertStatus(403);
        $this->assertDatabaseMissing('products', [
            'name' => 'New Awesome Product',
        ]);
    }
}
