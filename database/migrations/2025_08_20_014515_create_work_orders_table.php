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
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('work_orders');
    }
};
