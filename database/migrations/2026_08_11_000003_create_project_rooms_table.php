<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_rooms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lot_id')->constrained('project_lots')->onDelete('cascade');
            $table->string('slug');
            $table->string('title');
            $table->string('cover_image_id')->nullable();
            $table->string('cover_image_type')->default('image');
            $table->integer('order')->default(0);
            $table->timestamps();

            $table->unique(['lot_id', 'slug']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_rooms');
    }
};
