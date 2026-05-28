<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    public function index(): JsonResponse
    {
        $products = Product::where('isActive', true)->get();
        return response()->json([
            'status' => 'success',
            'data' => $products
        ]);
    }
}
