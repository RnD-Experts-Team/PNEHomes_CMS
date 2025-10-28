<?php
// database/migrations/2025_10_28_000003_create_communities_settings_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('communities_settings', function (Blueprint $table) {
            $table->id();
            $table->string('title')->default('Communities');
            $table->string('cover_image_id')->nullable();
            $table->string('zillow_link')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('communities_settings');
    }
};
