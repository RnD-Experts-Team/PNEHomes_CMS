<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('building_options_settings', function (Blueprint $table) {
            $table->id();
            $table->string('cover_image_id');
            $table->string('articles_cover_image_id');
            $table->string('slogan');
            $table->string('title');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('building_options_settings');
    }
};
