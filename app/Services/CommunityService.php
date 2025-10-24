<?php

namespace App\Services;

use App\Models\Community;
use App\Models\CommunityGallery;
use App\Models\CommunityContact;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class CommunityService
{
    public function getAllCommunities()
    {
        return Community::where('is_active', true)
            ->orderBy('order')
            ->get();
    }

    public function getCommunityBySlug(string $slug)
    {
        return Community::with('gallery')
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();
    }

    public function getAllForAdmin()
    {
        return Community::orderBy('order')->orderBy('created_at', 'desc')->get();
    }

    public function getCommunityForAdmin(int $id)
    {
        return Community::with('gallery')->findOrFail($id);
    }

    public function createCommunity(array $data): Community
    {
        return DB::transaction(function () use ($data) {
            if (empty($data['slug'])) {
                $data['slug'] = Str::slug($data['title']);
            }

            $community = Community::create([
                'slug' => $data['slug'],
                'title' => $data['title'],
                'city' => $data['city'],
                'address' => $data['address'],
                'card_image_id' => $data['card_image_id'],
                'video_id' => $data['video_id'] ?? null,
                'community_features' => $data['community_features'] ?? null,
                'starting_price' => $data['starting_price'],
                'order' => $data['order'] ?? 0,
                'is_active' => $data['is_active'] ?? true,
            ]);

            // Create gallery
            if (!empty($data['gallery'])) {
                foreach ($data['gallery'] as $index => $imageId) {
                    CommunityGallery::create([
                        'community_id' => $community->id,
                        'image_id' => $imageId,
                        'order' => $index,
                    ]);
                }
            }

            return $community->load('gallery');
        });
    }

    public function updateCommunity(int $id, array $data): Community
    {
        return DB::transaction(function () use ($id, $data) {
            $community = Community::findOrFail($id);

            if (empty($data['slug']) && isset($data['title'])) {
                $data['slug'] = Str::slug($data['title']);
            }

            $community->update([
                'slug' => $data['slug'] ?? $community->slug,
                'title' => $data['title'] ?? $community->title,
                'city' => $data['city'] ?? $community->city,
                'address' => $data['address'] ?? $community->address,
                'card_image_id' => $data['card_image_id'] ?? $community->card_image_id,
                'video_id' => $data['video_id'] ?? $community->video_id,
                'community_features' => $data['community_features'] ?? $community->community_features,
                'starting_price' => $data['starting_price'] ?? $community->starting_price,
                'order' => $data['order'] ?? $community->order,
                'is_active' => $data['is_active'] ?? $community->is_active,
            ]);

            // Update gallery
            if (isset($data['gallery'])) {
                $community->gallery()->delete();
                foreach ($data['gallery'] as $index => $imageId) {
                    CommunityGallery::create([
                        'community_id' => $community->id,
                        'image_id' => $imageId,
                        'order' => $index,
                    ]);
                }
            }

            return $community->load('gallery');
        });
    }

    public function deleteCommunity(int $id): void
    {
        $community = Community::findOrFail($id);
        $community->delete();
    }

    public function getContact()
    {
        return CommunityContact::first();
    }
}
