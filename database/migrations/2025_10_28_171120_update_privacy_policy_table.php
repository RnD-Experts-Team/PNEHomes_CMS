<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('privacy_policy', function (Blueprint $table) {
            $table->string('title')->after('id');
            $table->string('slogan')->after('title');
            $table->longText('description')->nullable()->after('slogan');
            $table->string('cover_image_id')->after('description');
            $table->string('contact_title');
            $table->text('contact_message')->after('contact_title');
            $table->dropColumn('content');
        });
    }

    public function down(): void
    {
        Schema::table('privacy_policy', function (Blueprint $table) {
            $table->dropColumn([
                'title',
                'slogan',
                'description',
                'cover_image_id',
                'contact_title',
                'contact_message'
            ]);
            $table->string('content');
        });
    }
};
