<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_settings', function (Blueprint $table) {
            $table->id();
            $table->string('title')->default('Our Projects');
            $table->string('cover_image_id')->nullable();
            $table->string('cover_image_type')->default('image');
            $table->string('contact_title')->default('Interested in a home like this?');
            $table->text('contact_message');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_settings');
    }
};
