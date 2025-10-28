<?php

// database/migrations/2025_10_28_000001_add_lat_lng_to_communities.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('communities', function (Blueprint $table) {
            $table->decimal('latitude', 10, 7)->nullable()->after('address');
            $table->decimal('longitude', 10, 7)->nullable()->after('latitude');
        });
    }
    public function down(): void {
        Schema::table('communities', function (Blueprint $table) {
            $table->dropColumn(['latitude', 'longitude']);
        });
    }
};
