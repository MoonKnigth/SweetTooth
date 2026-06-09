<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add 'refunded' to orders table status enum
        DB::statement('ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check');
        DB::statement("ALTER TABLE orders ADD CONSTRAINT orders_status_check CHECK (status IN ('pending', 'paid', 'completed', 'cancelled', 'refunded'))");

        // Add 'refunded' to payments table status enum
        DB::statement('ALTER TABLE payments ALTER COLUMN status TYPE VARCHAR(20)');
        DB::statement('ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_status_check');
        DB::statement("ALTER TABLE payments ADD CONSTRAINT payments_status_check CHECK (status IN ('pending', 'successful', 'failed', 'reversed', 'expired', 'refunded'))");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check');
        DB::statement("ALTER TABLE orders ADD CONSTRAINT orders_status_check CHECK (status IN ('pending', 'paid', 'completed', 'cancelled'))");

        DB::statement('ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_status_check');
        DB::statement("ALTER TABLE payments ADD CONSTRAINT payments_status_check CHECK (status IN ('pending', 'successful', 'failed', 'reversed', 'expired'))");
    }
};
