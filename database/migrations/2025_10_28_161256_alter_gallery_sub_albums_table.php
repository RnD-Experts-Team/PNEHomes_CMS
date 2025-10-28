<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('gallery_sub_albums', function (Blueprint $table) {
            // Drop old cover fields
            $table->dropColumn(['cover_virtual_image_id', 'cover_real_image_id']);
            
            // Add new single cover field
            $table->string('cover_image_id')->after('title');
        });
    }

    public function down(): void
    {
        Schema::table('gallery_sub_albums', function (Blueprint $table) {
            $table->dropColumn('cover_image_id');
            $table->string('cover_virtual_image_id');
            $table->string('cover_real_image_id');
        });
    }
};
