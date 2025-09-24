<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('work_orders', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(DB::raw('gen_random_uuid()'));
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->string('customer_name');
            $table->string('whatsapp_number');
            $table->string('order_title');
            $table->text('order_description')->nullable();
            $table->string('printing_size');
            $table->string('printing_material');
            $table->date('order_deadline');
            $table->integer('order_cost')->nullable();
            $table->enum('order_status', ['PENDING', 'IN_PROCESS', 'FINISHED', 'PICKED_UP'])->default('PENDING');
            $table->timestamps();

            $table->index('customer_name');
            $table->index('order_title');
            $table->index('whatsapp_number');
            $table->index('order_status');
            $table->index('order_deadline');
            $table->index(['user_id', 'order_status']);
        });

        DB::statement('CREATE INDEX work_orders_customer_name_lower_idx ON work_orders USING btree (LOWER(customer_name) text_pattern_ops)');
        DB::statement('CREATE INDEX work_orders_order_title_lower_idx ON work_orders USING btree (LOWER(order_title) text_pattern_ops)');
        DB::statement('CREATE INDEX work_orders_whatsapp_pattern_idx ON work_orders USING btree (whatsapp_number text_pattern_ops)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP INDEX IF EXISTS work_orders_customer_name_lower_idx');
        DB::statement('DROP INDEX IF EXISTS work_orders_order_title_lower_idx');
        DB::statement('DROP INDEX IF EXISTS work_orders_whatsapp_pattern_idx');

        Schema::dropIfExists('work_orders');
    }
};
