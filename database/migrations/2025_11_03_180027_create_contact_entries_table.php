<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('contact_entries', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email');
            $table->string('phone_number');
            $table->text('message');

            $table->unsignedInteger('land_area_sqft')->nullable();
            $table->string('land_address')->nullable();

            $table->timestamps();
            $table->index(['created_at']);
            $table->index(['email']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('contact_entries');
    }
};
