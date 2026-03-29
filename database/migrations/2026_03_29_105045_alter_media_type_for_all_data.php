<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // TEAM
        Schema::table('team_settings', function (Blueprint $table) {
            $table->string('cover_image_type')->default('image');
        });

        Schema::table('team_members', function (Blueprint $table) {
            $table->string('cover_image_type')->default('image');
        });

        // SERVICES
        Schema::table('services_settings', function (Blueprint $table) {
            $table->string('image_type')->default('image');
        });

        Schema::table('service_content_items', function (Blueprint $table) {
            $table->string('image_type')->default('image');
        });

        Schema::table('services', function (Blueprint $table) {
            $table->string('cover_image_type')->default('image');
        });

        // PROPERTY
        Schema::table('property_settings', function (Blueprint $table) {
            $table->string('cover_image_type')->default('image');
        });

        Schema::table('property_galleries', function (Blueprint $table) {
            $table->string('image_type')->default('image');
        });

        Schema::table('property_floor_plans', function (Blueprint $table) {
            $table->string('image_type')->default('image');
        });

        // PRIVACY
        Schema::table('privacy_policy', function (Blueprint $table) {
            $table->string('cover_image_type')->default('image');
        });

        // NAVIGATION
        Schema::table('navigation', function (Blueprint $table) {
            $table->string('logo_image_type')->default('image');
        });

        // HOME
        Schema::table('home_services', function (Blueprint $table) {
            $table->string('cover_image_type')->default('image');
        });

        Schema::table('home_grid_section', function (Blueprint $table) {
            $table->string('video_type')->default('video');
            $table->string('logo_image_type')->default('image');
        });

        Schema::table('home_grid_links', function (Blueprint $table) {
            $table->string('cover_image_type')->default('image');
        });

        Schema::table('home_first_section', function (Blueprint $table) {
            $table->string('mobile_cover_image_type')->default('image');
            $table->string('logo_image_type')->default('image');
        });

        // GALLERY
        Schema::table('gallery_sub_albums', function (Blueprint $table) {
            $table->string('cover_image_type')->default('image');
        });

        Schema::table('gallery_settings', function (Blueprint $table) {
            $table->string('cover_image_type')->default('image');
        });

        Schema::table('gallery_images', function (Blueprint $table) {
            $table->string('virtual_image_type')->default('image');
            $table->string('real_image_type')->default('image');
        });

        Schema::table('gallery_albums', function (Blueprint $table) {
            $table->string('cover_image_type')->default('image');
        });

        // FLOOR PLAN
        Schema::table('floor_plans', function (Blueprint $table) {
            $table->string('image_type')->default('image');
        });

        // EVENTS
        Schema::table('event_settings', function (Blueprint $table) {
            $table->string('cover_image_type')->default('image');
        });

        Schema::table('event_galleries', function (Blueprint $table) {
            $table->string('image_type')->default('image');
        });

        Schema::table('events', function (Blueprint $table) {
            $table->string('cover_image_type')->default('image');
        });

        // COMMUNITY
        Schema::table('community_galleries', function (Blueprint $table) {
            $table->string('image_type')->default('image');
        });

        Schema::table('communities', function (Blueprint $table) {
            $table->string('card_image_type')->default('image');
            $table->string('video_type')->default('video');
        });

        Schema::table('communities_settings', function (Blueprint $table) {
            $table->string('cover_image_type')->default('image');
        });

        Schema::table('communities_floorplans', function (Blueprint $table) {
            $table->string('cover_image_type')->default('image');
        });

        // BUILDING
        Schema::table('building_options_settings', function (Blueprint $table) {
            $table->string('cover_image_type')->default('image');
            $table->string('articles_cover_image_type')->default('image');
        });

        Schema::table('building_options', function (Blueprint $table) {
            $table->string('section_image_type')->default('image');
        });

        Schema::table('building_articles', function (Blueprint $table) {
            $table->string('image_type')->default('image');
        });

        // ABOUT
        Schema::table('about_us', function (Blueprint $table) {
            $table->string('cover_image_type')->default('image');
        });
    }

    public function down(): void
    {
        // TEAM
        Schema::table('team_settings', function (Blueprint $table) {
            $table->dropColumn('cover_image_type');
        });

        Schema::table('team_members', function (Blueprint $table) {
            $table->dropColumn('cover_image_type');
        });

        // SERVICES
        Schema::table('services_settings', function (Blueprint $table) {
            $table->dropColumn('image_type');
        });

        Schema::table('service_content_items', function (Blueprint $table) {
            $table->dropColumn('image_type');
        });

        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn('cover_image_type');
        });

        // PROPERTY
        Schema::table('property_settings', function (Blueprint $table) {
            $table->dropColumn('cover_image_type');
        });

        Schema::table('property_galleries', function (Blueprint $table) {
            $table->dropColumn('image_type');
        });

        Schema::table('property_floor_plans', function (Blueprint $table) {
            $table->dropColumn('image_type');
        });

        // PRIVACY
        Schema::table('privacy_policy', function (Blueprint $table) {
            $table->dropColumn('cover_image_type');
        });

        // NAVIGATION
        Schema::table('navigation', function (Blueprint $table) {
            $table->dropColumn('logo_image_type');
        });

        // HOME
        Schema::table('home_services', function (Blueprint $table) {
            $table->dropColumn('cover_image_type');
        });

        Schema::table('home_grid_section', function (Blueprint $table) {
            $table->dropColumn(['video_type', 'logo_image_type']);
        });

        Schema::table('home_grid_links', function (Blueprint $table) {
            $table->dropColumn('cover_image_type');
        });

        Schema::table('home_first_section', function (Blueprint $table) {
            $table->dropColumn(['mobile_cover_image_type', 'logo_image_type']);
        });

        // GALLERY
        Schema::table('gallery_sub_albums', function (Blueprint $table) {
            $table->dropColumn('cover_image_type');
        });

        Schema::table('gallery_settings', function (Blueprint $table) {
            $table->dropColumn('cover_image_type');
        });

        Schema::table('gallery_images', function (Blueprint $table) {
            $table->dropColumn(['virtual_image_type', 'real_image_type']);
        });

        Schema::table('gallery_albums', function (Blueprint $table) {
            $table->dropColumn('cover_image_type');
        });

        // FLOOR PLAN
        Schema::table('floor_plans', function (Blueprint $table) {
            $table->dropColumn('image_type');
        });

        // EVENTS
        Schema::table('event_settings', function (Blueprint $table) {
            $table->dropColumn('cover_image_type');
        });

        Schema::table('event_galleries', function (Blueprint $table) {
            $table->dropColumn('image_type');
        });

        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn('cover_image_type');
        });

        // COMMUNITY
        Schema::table('community_galleries', function (Blueprint $table) {
            $table->dropColumn('image_type');
        });

        Schema::table('communities', function (Blueprint $table) {
            $table->dropColumn(['card_image_type', 'video_type']);
        });

        Schema::table('communities_settings', function (Blueprint $table) {
            $table->dropColumn('cover_image_type');
        });

        Schema::table('communities_floorplans', function (Blueprint $table) {
            $table->dropColumn('cover_image_type');
        });

        // BUILDING
        Schema::table('building_options_settings', function (Blueprint $table) {
            $table->dropColumn(['cover_image_type', 'articles_cover_image_type']);
        });

        Schema::table('building_options', function (Blueprint $table) {
            $table->dropColumn('section_image_type');
        });

        Schema::table('building_articles', function (Blueprint $table) {
            $table->dropColumn('image_type');
        });

        // ABOUT
        Schema::table('about_us', function (Blueprint $table) {
            $table->dropColumn('cover_image_type');
        });
    }
};