<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $categoriesData = [
            'Waffle', 'Crème Brûlée', 'Macaron', 'Tiramisu', 
            'Baklava', 'Pie', 'Cake', 'Brownie', 'Panna Cotta'
        ];

        $categories = [];
        foreach ($categoriesData as $catName) {
            $categories[$catName] = Category::create([
                'name' => $catName,
                'slug' => Str::slug($catName)
            ])->id;
        }

        $products = [
            [
                'name' => 'Waffle with Berries',
                'category_id' => $categories['Waffle'],
                'price' => 6.50,
                'image_thumbnail' => 'https://images.unsplash.com/photo-1568051243851-f9b136146e97?auto=format&fit=crop&w=400&q=80',
                'isActive' => true,
            ],
            [
                'name' => 'Vanilla Bean Crème Brûlée',
                'category_id' => $categories['Crème Brûlée'],
                'price' => 7.00,
                'image_thumbnail' => 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?auto=format&fit=crop&w=400&q=80',
                'isActive' => true,
            ],
            [
                'name' => 'Macaron Mix of Five',
                'category_id' => $categories['Macaron'],
                'price' => 8.00,
                'image_thumbnail' => 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=400&q=80',
                'isActive' => true,
            ],
            [
                'name' => 'Classic Tiramisu',
                'category_id' => $categories['Tiramisu'],
                'price' => 5.50,
                'image_thumbnail' => 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=400&q=80',
                'isActive' => true,
            ],
            [
                'name' => 'Pistachio Baklava',
                'category_id' => $categories['Baklava'],
                'price' => 4.00,
                'image_thumbnail' => 'https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=400&q=80',
                'isActive' => true,
            ],
            [
                'name' => 'Lemon Meringue Pie',
                'category_id' => $categories['Pie'],
                'price' => 5.00,
                'image_thumbnail' => 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?auto=format&fit=crop&w=400&q=80',
                'isActive' => true,
            ],
            [
                'name' => 'Red Velvet Cake',
                'category_id' => $categories['Cake'],
                'price' => 4.50,
                'image_thumbnail' => 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=400&q=80',
                'isActive' => true,
            ],
            [
                'name' => 'Salted Caramel Brownie',
                'category_id' => $categories['Brownie'],
                'price' => 5.50,
                'image_thumbnail' => 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=400&q=80',
                'isActive' => true,
            ],
            [
                'name' => 'Vanilla Panna Cotta',
                'category_id' => $categories['Panna Cotta'],
                'price' => 6.50,
                'image_thumbnail' => 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=80',
                'isActive' => true,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
