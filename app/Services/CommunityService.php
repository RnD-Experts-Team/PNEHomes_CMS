<?php
// app/Services/CommunityService.php

namespace App\Services;

use App\Models\Community;
use App\Models\CommunityGallery;
use App\Models\CommunityContact;
use App\Models\CommunitiesSetting;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class CommunityService
{
    public function getSettings(): CommunitiesSetting
    {
        return CommunitiesSetting::firstOrCreate([], [
            'title' => 'Communities',
            'cover_image_id' => null,
            'zillow_link' => null,
        ]);
    }

    public function getAllCommunities()
    {
        return Community::where('is_active', true)
            ->with(['gallery','floorplans'])
            ->orderBy('order')
            ->get();
    }

    public function getCommunityBySlug(string $slug)
    {
        return Community::with(['gallery','floorplans'])
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();
    }

    public function getAllForAdmin()
    {
        return Community::orderBy('order')->orderBy('created_at','desc')->get();
    }

    public function getCommunityForAdmin(int $id)
    {
        return Community::with('gallery')->findOrFail($id);
    }

    public function getContact(): ?CommunityContact
    {
        return CommunityContact::first();
    }

    public function createCommunity(array $data): Community
    {
        return DB::transaction(function () use ($data) {
            $data['slug'] = Str::slug($data['title']);

            $community = Community::create([
                'slug' => $data['slug'],
                'title' => $data['title'],
                'city' => $data['city'],
                'address' => $data['address'],
                'latitude' => $data['latitude'] ?? null,
                'longitude' => $data['longitude'] ?? null,
                'card_image_id' => $data['card_image_id'],
                'video_id' => $data['video_id'] ?? null,
                'community_features' => $data['community_features'] ?? null,
                'starting_price' => $data['starting_price'],
                'order' => $data['order'] ?? 0,
                'is_active' => $data['is_active'] ?? true,
            ]);

            if (!empty($data['gallery'])) {
                foreach ($data['gallery'] as $index => $imageId) {
                    CommunityGallery::create([
                        'community_id' => $community->id,
                        'image_id' => $imageId,
                        'order' => $index,
                    ]);
                }
            }

            return $community->load(['gallery','floorplans']);
        });
    }

    public function updateCommunity(int $id, array $data): Community
    {
        return DB::transaction(function () use ($id, $data) {
            $community = Community::findOrFail($id);

            $slug = $community->slug;
            if (isset($data['title']) && $data['title'] !== $community->title) {
                $slug = Str::slug($data['title']);
            }

            $community->update([
                'slug' => $slug,
                'title' => $data['title'] ?? $community->title,
                'city' => $data['city'] ?? $community->city,
                'address' => $data['address'] ?? $community->address,
                'latitude' => $data['latitude'] ?? $community->latitude,
                'longitude' => $data['longitude'] ?? $community->longitude,
                'card_image_id' => $data['card_image_id'] ?? $community->card_image_id,
                'video_id' => $data['video_id'] ?? $community->video_id,
                'community_features' => $data['community_features'] ?? $community->community_features,
                'starting_price' => $data['starting_price'] ?? $community->starting_price,
                'order' => $data['order'] ?? $community->order,
                'is_active' => $data['is_active'] ?? $community->is_active,
            ]);

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

            return $community->load(['gallery','floorplans']);
        });
    }

    /**
     * Update page settings + contact together.
     */
    public function updateSettingsAndContact(array $settingsData, array $contactData = []): CommunitiesSetting
    {
        return DB::transaction(function () use ($settingsData, $contactData) {
            // Settings
            $settings = $this->getSettings();
            $settings->update([
                'title' => $settingsData['title'] ?? $settings->title,
                'cover_image_id' => $settingsData['cover_image_id'] ?? $settings->cover_image_id,
                'zillow_link' => $settingsData['zillow_link'] ?? $settings->zillow_link,
            ]);

            // Contact (create if missing)
            if (!empty($contactData)) {
                $contact = $this->getContact() ?? new CommunityContact();
                $contact->fill([
                    'title' => $contactData['title'] ?? $contact->title,
                    'message' => $contactData['message'] ?? $contact->message,
                ]);
                $contact->save();
            }

            return $settings->refresh();
        });
    }
    public function deleteCommunity(int $id): void
{
    $community = Community::findOrFail($id);
    $community->delete();
}

}
