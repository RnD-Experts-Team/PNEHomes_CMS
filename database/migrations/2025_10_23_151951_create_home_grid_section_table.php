<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('home_grid_section', function (Blueprint $table) {
            $table->id();
            $table->string('video_id');
            $table->string('logo_image_id');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('home_grid_section');
    }
};
