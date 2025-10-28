<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gallery_settings', function (Blueprint $table) {
            $table->id();
            $table->string('title')->default("Gallery");
            $table->string('cover_image_id');
            $table->string('contact_title')->default("Contact Us");
            $table->text('contact_message');
            $table->timestamps();
        });

        Schema::dropIfExists('gallery_contacts');
    }

    public function down(): void
    {
        Schema::dropIfExists('gallery_settings');
        Schema::create('gallery_contacts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('message');
            $table->timestamps();
        });
    }
};
