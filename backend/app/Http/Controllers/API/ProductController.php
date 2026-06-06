<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    public function index(): JsonResponse
    {
        $products = Product::with('category')->where('isActive', true)->get();

        $formattedProducts = $products->map(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'category_id' => $product->category_id,
                'category' => $product->category ? $product->category->name : null,
                'price' => $product->price,
                'image_thumbnail' => $product->image_thumbnail,
                'image_mobile' => $product->image_mobile,
                'image_tablet' => $product->image_tablet,
                'image_desktop' => $product->image_desktop,
                'isActive' => $product->isActive,
            ];
        });

        return response()->json([
            'status' => 'success',
            'data' => $formattedProducts,
        ]);
    }
}
