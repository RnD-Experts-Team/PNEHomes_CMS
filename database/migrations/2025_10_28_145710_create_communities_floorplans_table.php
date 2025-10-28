<?php
// database/migrations/2025_10_28_000002_create_communities_floorplans_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('communities_floorplans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('community_id')->constrained('communities')->onDelete('cascade');
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('cover_image_id');
            $table->string('status')->nullable(); // matches TS
            $table->string('price')->nullable();
            $table->string('beds')->nullable();
            $table->string('baths')->nullable();
            $table->string('garages')->nullable();
            $table->string('sqft')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('communities_floorplans');
    }
};
