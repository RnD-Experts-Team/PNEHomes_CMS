<?php

namespace App\Services;

use App\Models\Service;
use App\Models\ServiceContentItem;
use App\Models\ServiceContact;
use App\Models\ServicesSetting;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class ServiceService
{
    public function getAllServices()
    {
        return Service::with(['contentItems', 'contact'])
            ->where('is_active', true)
            ->orderBy('order')
            ->get();
    }

    public function getServiceBySlug(string $slug)
    {
        return Service::with(['contentItems', 'contact'])
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();
    }

    public function getAllForAdmin()
    {
        return Service::orderBy('order')->orderBy('created_at', 'desc')->get();
    }

    public function getServiceForAdmin(int $id)
    {
        return Service::with(['contentItems', 'contact'])->findOrFail($id);
    }

    public function createService(array $data): Service
    {
        return DB::transaction(function () use ($data) {
            // Generate slug if not provided
            if (empty($data['slug'])) {
                $data['slug'] = Str::slug($data['title']);
            }

            $service = Service::create([
                'slug' => $data['slug'],
                'title' => $data['title'],
                'sub_title' => $data['sub_title'] ?? null,
                'description' => $data['description'] ?? null,
                'cover_image_id' => $data['cover_image_id'] ?? null,
                'order' => $data['order'] ?? 0,
                'is_active' => $data['is_active'] ?? true,
            ]);

            // Create content items
            if (!empty($data['content_items'])) {
                foreach ($data['content_items'] as $index => $item) {
                    ServiceContentItem::create([
                        'service_id' => $service->id,
                        'image_id' => $item['image_id'],
                        'sub_title' => $item['sub_title'],
                        'description' => $item['description'],
                        'order' => $index,
                    ]);
                }
            }

            // Create contact
            if (!empty($data['contact'])) {
                ServiceContact::create([
                    'service_id' => $service->id,
                    'title' => $data['contact']['title'],
                    'message' => $data['contact']['message'],
                ]);
            }

            return $service->load(['contentItems', 'contact']);
        });
    }

    public function updateService(int $id, array $data): Service
    {
        return DB::transaction(function () use ($id, $data) {
            $service = Service::findOrFail($id);

            // Update slug if title changed
            if (empty($data['slug']) && isset($data['title'])) {
                $data['slug'] = Str::slug($data['title']);
            }

            $service->update([
                'slug' => $data['slug'] ?? $service->slug,
                'title' => $data['title'] ?? $service->title,
                'sub_title' => $data['sub_title'] ?? $service->sub_title,
                'description' => $data['description'] ?? $service->description,
                'cover_image_id' => $data['cover_image_id'] ?? $service->cover_image_id,
                'order' => $data['order'] ?? $service->order,
                'is_active' => $data['is_active'] ?? $service->is_active,
            ]);

            // Update content items
            if (isset($data['content_items'])) {
                $service->contentItems()->delete();
                foreach ($data['content_items'] as $index => $item) {
                    ServiceContentItem::create([
                        'service_id' => $service->id,
                        'image_id' => $item['image_id'],
                        'sub_title' => $item['sub_title'],
                        'description' => $item['description'],
                        'order' => $index,
                    ]);
                }
            }

            // Update contact
            if (isset($data['contact'])) {
                $service->contact()->updateOrCreate(
                    ['service_id' => $service->id],
                    [
                        'title' => $data['contact']['title'],
                        'message' => $data['contact']['message'],
                    ]
                );
            }

            return $service->load(['contentItems', 'contact']);
        });
    }

    public function deleteService(int $id): void
    {
        $service = Service::findOrFail($id);
        $service->delete();
    }



    public function getSettings(): ServicesSetting
    {
        return ServicesSetting::firstOrCreate([], [
            'image_id' => null,
        ]);
    }

        public function updateSettings(array $data)
    {
        $servicesSettings = $this->getSettings();
        $servicesSettings->update($data);
        
        return $servicesSettings;
    }
}
