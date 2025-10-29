<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('property_settings', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('cover_image_id');
            $table->string('contact_title');
            $table->text('contact_message');
            $table->timestamps();
        });

        Schema::dropIfExists('property_contacts');
    }

    public function down(): void
    {
        Schema::dropIfExists('property_settings');
        Schema::create('property_contacts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('message');
            $table->timestamps();
        });
    }
};
