<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('home_first_section', function (Blueprint $table) {
            $table->id();
            $table->string('video_id');
            $table->string('mobile_cover_image_id');
            $table->string('logo_image_id');
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->string('book_button_text')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('home_first_section');
    }
};
