<?php

namespace Database\Seeders;

use App\Models\ProjectLot;
use App\Models\ProjectSettings;
use Illuminate\Database\Seeder;

class ProjectLotSeeder extends Seeder
{
    /**
     * Seed the "Our Projects" settings row and the current lots
     * (see api-projects-contract.md §9 "Current lots to seed").
     *
     * Lots are created inactive (no rooms/photos yet) so they don't
     * appear on the public site until an admin fills them in via
     * /admin/project-lots and activates them.
     */
    public function run(): void
    {
        ProjectSettings::firstOrCreate([], [
            'title' => 'Our Projects',
            'cover_image_id' => '',
            'cover_image_type' => '',
            'contact_title' => 'Interested in a home like this?',
            'contact_message' => "I'm interested in {title}. Could you share more details?",
        ]);

        $lots = [
            ['title' => 'Lot 23', 'slug' => 'lot-23'],
            ['title' => 'Lot 24', 'slug' => 'lot-24'],
            ['title' => 'Lot 38', 'slug' => 'lot-38'],
            ['title' => 'Lot 49', 'slug' => 'lot-49'],
            ['title' => 'Lot 51', 'slug' => 'lot-51'],
            ['title' => 'Lot 62', 'slug' => 'lot-62'],
            ['title' => 'Lot 64', 'slug' => 'lot-64'],
            ['title' => 'Lot 7375', 'slug' => 'lot-7375'],
            ['title' => 'Lot 7577', 'slug' => 'lot-7577'],
        ];

        foreach ($lots as $order => $lot) {
            ProjectLot::firstOrCreate(
                ['slug' => $lot['slug']],
                [
                    'title' => $lot['title'],
                    'cover_image_id' => '',
                    'cover_image_type' => '',
                    'has_rooms' => true,
                    'order' => $order,
                    'is_active' => false,
                ]
            );
        }
    }
}
