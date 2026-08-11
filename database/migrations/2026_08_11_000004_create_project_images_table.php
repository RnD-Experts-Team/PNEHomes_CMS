<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lot_id')->nullable()->constrained('project_lots')->onDelete('cascade');
            $table->foreignId('room_id')->nullable()->constrained('project_rooms')->onDelete('cascade');
            $table->string('virtual_image_id')->nullable();
            $table->string('virtual_image_type')->nullable()->default('image');
            $table->string('real_image_id')->nullable();
            $table->string('real_image_type')->nullable()->default('image');
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_images');
    }
};
