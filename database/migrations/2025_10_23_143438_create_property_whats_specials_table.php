<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('property_whats_specials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->unique()->constrained()->onDelete('cascade');
            $table->json('badges');
            $table->text('description');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('property_whats_specials');
    }
};
