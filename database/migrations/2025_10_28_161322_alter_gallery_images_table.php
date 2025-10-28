<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('gallery_images', function (Blueprint $table) {
            $table->string('virtual_image_id')->nullable()->change();
            $table->string('real_image_id')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('gallery_images', function (Blueprint $table) {
            $table->string('virtual_image_id')->nullable(false)->change();
            $table->string('real_image_id')->nullable(false)->change();
        });
    }
};
