<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('event_settings', function (Blueprint $table) {
            $table->id();
            $table->string('cover_image_id');
            $table->string('slogan');
            $table->string('contact_title')->nullable();
            $table->text('contact_message')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('event_settings');
    }
};
