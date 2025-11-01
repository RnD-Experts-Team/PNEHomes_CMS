<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * NOTE: This migration assumes MySQL/MariaDB.
     * It alters the existing ENUM column using raw SQL.
     */
    public function up(): void
    {
        // 1) Update existing data: twitter -> x
        DB::table('social_links')
            ->where('platform', 'twitter')
            ->update(['platform' => 'x']);

        // 2) Alter ENUM set to the new values (including empty string '')
        //    Allowed: '', facebook, instagram, youtube, x, linkedin, pinterest, zillow, tiktok, other
        DB::statement("
            ALTER TABLE `social_links`
            MODIFY `platform` ENUM(
                '',
                'facebook',
                'instagram',
                'youtube',
                'x',
                'linkedin',
                'pinterest',
                'zillow',
                'tiktok',
                'other'
            ) NOT NULL
        ");
    }

    public function down(): void
    {
        // 1) Map x back to twitter (so it passes the old enum constraint)
        DB::table('social_links')
            ->where('platform', 'x')
            ->update(['platform' => 'twitter']);

        // 2) Restore the original enum set
        DB::statement("
            ALTER TABLE `social_links`
            MODIFY `platform` ENUM(
                'facebook',
                'instagram',
                'youtube',
                'twitter',
                'linkedin'
            ) NOT NULL
        ");

        // 3) Optionally, replace any '' (empty) with a sensible default (e.g., 'other') before down-migrating
        // If you had rows with '' they wouldn't be allowed by the old enum.
        // Uncomment this block BEFORE the ALTER above if needed:
        //
        // DB::table('social_links')
        //   ->where('platform', '')
        //   ->update(['platform' => 'facebook']); // or any allowed old value
    }
};
