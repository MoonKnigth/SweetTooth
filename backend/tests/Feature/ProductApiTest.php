<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_get_products_with_category()
    {
        $category = Category::create([
            'name' => 'Dessert',
            'slug' => 'dessert',
        ]);

        Product::create([
            'name' => 'Test Waffle',
            'category_id' => $category->id,
            'price' => 5.99,
            'isActive' => true,
        ]);

        $response = $this->getJson('/api/products');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'price',
                        'category',
                    ],
                ],
            ])
            ->assertJsonFragment(['name' => 'Test Waffle'])
            ->assertJsonFragment(['category' => 'Dessert']);
    }

    public function test_soft_deleted_products_are_hidden()
    {
        $category = Category::create([
            'name' => 'Dessert',
            'slug' => 'dessert',
        ]);

        $product = Product::create([
            'name' => 'Deleted Waffle',
            'category_id' => $category->id,
            'price' => 5.99,
            'isActive' => true,
        ]);

        $product->delete();

        $response = $this->getJson('/api/products');

        $response->assertStatus(200)
            ->assertJsonMissing(['name' => 'Deleted Waffle']);
    }
}
