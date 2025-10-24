<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('community');
            $table->string('price');
            $table->string('beds');
            $table->string('baths');
            $table->string('garages');
            $table->string('sqft');
            $table->string('zillow_link')->nullable();
            $table->string('next_property_slug')->nullable();
            $table->string('prev_property_slug')->nullable();
            $table->string('cover_image_id')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
