<?php

namespace App\Services;

use App\Models\ProjectLot;
use App\Models\ProjectRoom;
use App\Models\ProjectImage;
use App\Models\ProjectSettings;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class ProjectService
{
    // ============ Settings Methods ============

    public function getSettings(): ProjectSettings
    {
        return ProjectSettings::firstOrCreate([], [
            'title' => 'Our Projects',
            'cover_image_id' => '',
            'cover_image_type' => '',
            'contact_title' => 'Interested in a home like this?',
            'contact_message' => "I'm interested in {title}. Could you share more details?",
        ]);
    }

    public function updateSettings(array $data): ProjectSettings
    {
        $settings = $this->getSettings();
        $settings->update([
            'title' => $data['title'] ?? $settings->title,
            'cover_image_id' => $data['cover_image_id'] ?? $settings->cover_image_id,
            'cover_image_type' => $data['cover_image_type'] ?? $settings->cover_image_type,
            'contact_title' => $data['contact_title'] ?? $settings->contact_title,
            'contact_message' => $data['contact_message'] ?? $settings->contact_message,
        ]);
        return $settings->refresh();
    }

    // ============ Lot Methods ============

    public function getAllLots()
    {
        return ProjectLot::where('is_active', true)
            ->with(['rooms.images', 'images'])
            ->orderBy('order')
            ->get();
    }

    public function getLotBySlug(string $slug)
    {
        return ProjectLot::with(['rooms.images', 'images'])
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();
    }

    public function getAllLotsForAdmin()
    {
        return ProjectLot::orderBy('order')->orderBy('created_at', 'desc')->get();
    }

    public function getLotForAdmin(int $id)
    {
        return ProjectLot::with(['rooms.images', 'images'])->findOrFail($id);
    }

    public function createLot(array $data): ProjectLot
    {
        return DB::transaction(function () use ($data) {
            $data['slug'] = Str::slug($data['title']);

            $lot = ProjectLot::create([
                'slug' => $data['slug'],
                'title' => $data['title'],
                'cover_image_id' => $data['cover_image_id'],
                'cover_image_type' => $data['cover_image_type'] ?? null,
                'has_rooms' => $data['has_rooms'] ?? false,
                'order' => $data['order'] ?? 0,
                'is_active' => $data['is_active'] ?? true,
            ]);

            // If has rooms
            if ($lot->has_rooms && !empty($data['rooms'])) {
                foreach ($data['rooms'] as $roomIndex => $roomData) {
                    $roomData['slug'] = Str::slug($roomData['title']);

                    $room = ProjectRoom::create([
                        'lot_id' => $lot->id,
                        'slug' => $roomData['slug'],
                        'title' => $roomData['title'],
                        'cover_image_id' => $roomData['cover_image_id'],
                        'cover_image_type' => $roomData['cover_image_type'] ?? null,
                        'order' => $roomIndex,
                    ]);

                    // Create images for room
                    if (!empty($roomData['images'])) {
                        foreach ($roomData['images'] as $imgIndex => $imgData) {
                            ProjectImage::create([
                                'lot_id' => $lot->id,
                                'room_id' => $room->id,
                                'virtual_image_id' => $imgData['virtual_image_id'] ?? null,
                                'virtual_image_type' => $imgData['virtual_image_type'] ?? null,
                                'real_image_id' => $imgData['real_image_id'] ?? null,
                                'real_image_type' => $imgData['real_image_type'] ?? null,
                                'order' => $imgIndex,
                            ]);
                        }
                    }
                }
            } else {
                // No rooms, create images directly
                if (!empty($data['images'])) {
                    foreach ($data['images'] as $imgIndex => $imgData) {
                        ProjectImage::create([
                            'lot_id' => $lot->id,
                            'room_id' => null,
                            'virtual_image_id' => $imgData['virtual_image_id'] ?? null,
                            'virtual_image_type' => $imgData['virtual_image_type'] ?? null,
                            'real_image_id' => $imgData['real_image_id'] ?? null,
                            'real_image_type' => $imgData['real_image_type'] ?? null,
                            'order' => $imgIndex,
                        ]);
                    }
                }
            }

            return $lot->load(['rooms.images', 'images']);
        });
    }

    public function updateLot(int $id, array $data): ProjectLot
    {
        return DB::transaction(function () use ($id, $data) {
            $lot = ProjectLot::findOrFail($id);

            $slug = $lot->slug;
            if (isset($data['title']) && $data['title'] !== $lot->title) {
                $slug = Str::slug($data['title']);
            }

            $lot->update([
                'slug' => $slug,
                'title' => $data['title'] ?? $lot->title,
                'cover_image_id' => $data['cover_image_id'] ?? $lot->cover_image_id,
                'cover_image_type' => $data['cover_image_type'] ?? $lot->cover_image_type,
                'has_rooms' => $data['has_rooms'] ?? $lot->has_rooms,
                'order' => $data['order'] ?? $lot->order,
                'is_active' => $data['is_active'] ?? $lot->is_active,
            ]);

            // Delete all existing rooms and images
            $lot->rooms()->delete();
            $lot->images()->delete();

            // If has rooms
            if ($lot->has_rooms && !empty($data['rooms'])) {
                foreach ($data['rooms'] as $roomIndex => $roomData) {
                    $roomData['slug'] = Str::slug($roomData['title']);

                    $room = ProjectRoom::create([
                        'lot_id' => $lot->id,
                        'slug' => $roomData['slug'],
                        'title' => $roomData['title'],
                        'cover_image_id' => $roomData['cover_image_id'],
                        'cover_image_type' => $roomData['cover_image_type'] ?? null,
                        'order' => $roomIndex,
                    ]);

                    // Create images for room
                    if (!empty($roomData['images'])) {
                        foreach ($roomData['images'] as $imgIndex => $imgData) {
                            ProjectImage::create([
                                'lot_id' => $lot->id,
                                'room_id' => $room->id,
                                'virtual_image_id' => $imgData['virtual_image_id'] ?? null,
                                'virtual_image_type' => $imgData['virtual_image_type'] ?? null,
                                'real_image_id' => $imgData['real_image_id'] ?? null,
                                'real_image_type' => $imgData['real_image_type'] ?? null,
                                'order' => $imgIndex,
                            ]);
                        }
                    }
                }
            } else {
                // No rooms, create images directly
                if (!empty($data['images'])) {
                    foreach ($data['images'] as $imgIndex => $imgData) {
                        ProjectImage::create([
                            'lot_id' => $lot->id,
                            'room_id' => null,
                            'virtual_image_id' => $imgData['virtual_image_id'] ?? null,
                            'virtual_image_type' => $imgData['virtual_image_type'] ?? null,
                            'real_image_id' => $imgData['real_image_id'] ?? null,
                            'real_image_type' => $imgData['real_image_type'] ?? null,
                            'order' => $imgIndex,
                        ]);
                    }
                }
            }

            return $lot->load(['rooms.images', 'images']);
        });
    }

    public function deleteLot(int $id): void
    {
        $lot = ProjectLot::findOrFail($id);
        $lot->delete();
    }

    public function getRoomBySlug(int $lotId, string $roomSlug)
    {
        return ProjectRoom::with('images')
            ->where('lot_id', $lotId)
            ->where('slug', $roomSlug)
            ->firstOrFail();
    }
}
