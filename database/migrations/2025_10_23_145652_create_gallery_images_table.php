<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gallery_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('album_id')->nullable()->constrained('gallery_albums')->onDelete('cascade');
            $table->foreignId('sub_album_id')->nullable()->constrained('gallery_sub_albums')->onDelete('cascade');
            $table->string('virtual_image_id');
            $table->string('real_image_id');
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gallery_images');
    }
};
