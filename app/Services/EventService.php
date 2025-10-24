<?php

namespace App\Services;

use App\Models\Event;
use App\Models\EventGallery;
use App\Models\EventSetting;
use Illuminate\Support\Facades\DB;

class EventService
{
    public function getAllEvents()
    {
        return Event::with('gallery')
            ->where('is_active', true)
            ->orderBy('order')
            ->get();
    }

    public function getAllEventsForAdmin()
    {
        return Event::withCount('gallery')
            ->orderBy('order')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getEventForAdmin(int $id)
    {
        return Event::with('gallery')->findOrFail($id);
    }

    public function createEvent(array $data): Event
    {
        return DB::transaction(function () use ($data) {
            $event = Event::create([
                'title' => $data['title'],
                'description' => $data['description'],
                'cover_image_id' => $data['cover_image_id'] ?? null,
                'order' => $data['order'] ?? 0,
                'is_active' => $data['is_active'] ?? true,
            ]);

            // Create gallery
            if (!empty($data['gallery'])) {
                foreach ($data['gallery'] as $index => $imageId) {
                    EventGallery::create([
                        'event_id' => $event->id,
                        'image_id' => $imageId,
                        'order' => $index,
                    ]);
                }
            }

            return $event->load('gallery');
        });
    }

    public function updateEvent(int $id, array $data): Event
    {
        return DB::transaction(function () use ($id, $data) {
            $event = Event::findOrFail($id);

            $event->update([
                'title' => $data['title'] ?? $event->title,
                'description' => $data['description'] ?? $event->description,
                'cover_image_id' => $data['cover_image_id'] ?? $event->cover_image_id,
                'order' => $data['order'] ?? $event->order,
                'is_active' => $data['is_active'] ?? $event->is_active,
            ]);

            // Update gallery
            if (isset($data['gallery'])) {
                $event->gallery()->delete();
                foreach ($data['gallery'] as $index => $imageId) {
                    EventGallery::create([
                        'event_id' => $event->id,
                        'image_id' => $imageId,
                        'order' => $index,
                    ]);
                }
            }

            return $event->load('gallery');
        });
    }

    public function deleteEvent(int $id): void
    {
        $event = Event::findOrFail($id);
        $event->delete();
    }

    public function getSettings()
    {
        return EventSetting::first();
    }

    public function updateSettings(array $data)
    {
        $settings = EventSetting::first();

        if ($settings) {
            $settings->update($data);
        } else {
            $settings = EventSetting::create($data);
        }

        return $settings;
    }
}
