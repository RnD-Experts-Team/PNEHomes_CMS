<?php

namespace App\Services;

use App\Models\GalleryAlbum;
use App\Models\GallerySubAlbum;
use App\Models\GalleryImage;
use App\Models\GallerySettings;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class GalleryService
{
    // ============ Settings Methods ============
    
    public function getSettings(): GallerySettings
    {
        return GallerySettings::firstOrCreate([], [
            'title' => 'Gallery',
            'cover_image_id' => '',
            'contact_title' => 'Contact Us',
            'contact_message' => "I'm contacting you to ask about images of the {title}",
        ]);
    }

    public function updateSettings(array $data): GallerySettings
    {
        $settings = $this->getSettings();
        $settings->update([
            'title' => $data['title'] ?? $settings->title,
            'cover_image_id' => $data['cover_image_id'] ?? $settings->cover_image_id,
            'contact_title' => $data['contact_title'] ?? $settings->contact_title,
            'contact_message' => $data['contact_message'] ?? $settings->contact_message,
        ]);
        return $settings->refresh();
    }

    // ============ Album Methods (Keep existing logic) ============

    public function getAllAlbums()
    {
        return GalleryAlbum::where('is_active', true)
            ->with(['subAlbums.images', 'images'])
            ->orderBy('order')
            ->get();
    }

    public function getAlbumBySlug(string $slug)
    {
        return GalleryAlbum::with(['subAlbums.images', 'images'])
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();
    }

    public function getAllAlbumsForAdmin()
    {
        return GalleryAlbum::orderBy('order')->orderBy('created_at', 'desc')->get();
    }

    public function getAlbumForAdmin(int $id)
    {
        return GalleryAlbum::with(['subAlbums.images', 'images'])->findOrFail($id);
    }

    public function createAlbum(array $data): GalleryAlbum
    {
        return DB::transaction(function () use ($data) {
            $data['slug'] = Str::slug($data['title']);

            $album = GalleryAlbum::create([
                'slug' => $data['slug'],
                'title' => $data['title'],
                'cover_image_id' => $data['cover_image_id'],
                'has_sub_albums' => $data['has_sub_albums'] ?? false,
                'order' => $data['order'] ?? 0,
                'is_active' => $data['is_active'] ?? true,
            ]);

            // If has sub-albums
            if ($album->has_sub_albums && !empty($data['sub_albums'])) {
                foreach ($data['sub_albums'] as $subIndex => $subData) {
                    $subData['slug'] = Str::slug($subData['title']);
                    
                    $subAlbum = GallerySubAlbum::create([
                        'album_id' => $album->id,
                        'slug' => $subData['slug'],
                        'title' => $subData['title'],
                        'cover_image_id' => $subData['cover_image_id'],
                        'order' => $subIndex,
                    ]);

                    // Create images for sub-album
                    if (!empty($subData['images'])) {
                        foreach ($subData['images'] as $imgIndex => $imgData) {
                            GalleryImage::create([
                                'album_id' => $album->id,
                                'sub_album_id' => $subAlbum->id,
                                'virtual_image_id' => $imgData['virtual_image_id'] ?? null,
                                'real_image_id' => $imgData['real_image_id'] ?? null,
                                'order' => $imgIndex,
                            ]);
                        }
                    }
                }
            } else {
                // No sub-albums, create images directly
                if (!empty($data['images'])) {
                    foreach ($data['images'] as $imgIndex => $imgData) {
                        GalleryImage::create([
                            'album_id' => $album->id,
                            'sub_album_id' => null,
                            'virtual_image_id' => $imgData['virtual_image_id'] ?? null,
                            'real_image_id' => $imgData['real_image_id'] ?? null,
                            'order' => $imgIndex,
                        ]);
                    }
                }
            }

            return $album->load(['subAlbums.images', 'images']);
        });
    }

    public function updateAlbum(int $id, array $data): GalleryAlbum
    {
        return DB::transaction(function () use ($id, $data) {
            $album = GalleryAlbum::findOrFail($id);

            $slug = $album->slug;
            if (isset($data['title']) && $data['title'] !== $album->title) {
                $slug = Str::slug($data['title']);
            }

            $album->update([
                'slug' => $slug,
                'title' => $data['title'] ?? $album->title,
                'cover_image_id' => $data['cover_image_id'] ?? $album->cover_image_id,
                'has_sub_albums' => $data['has_sub_albums'] ?? $album->has_sub_albums,
                'order' => $data['order'] ?? $album->order,
                'is_active' => $data['is_active'] ?? $album->is_active,
            ]);

            // Delete all existing sub-albums and images
            $album->subAlbums()->delete();
            $album->images()->delete();

            // If has sub-albums
            if ($album->has_sub_albums && !empty($data['sub_albums'])) {
                foreach ($data['sub_albums'] as $subIndex => $subData) {
                    $subData['slug'] = Str::slug($subData['title']);
                    
                    $subAlbum = GallerySubAlbum::create([
                        'album_id' => $album->id,
                        'slug' => $subData['slug'],
                        'title' => $subData['title'],
                        'cover_image_id' => $subData['cover_image_id'],
                        'order' => $subIndex,
                    ]);

                    // Create images for sub-album
                    if (!empty($subData['images'])) {
                        foreach ($subData['images'] as $imgIndex => $imgData) {
                            GalleryImage::create([
                                'album_id' => $album->id,
                                'sub_album_id' => $subAlbum->id,
                                'virtual_image_id' => $imgData['virtual_image_id'] ?? null,
                                'real_image_id' => $imgData['real_image_id'] ?? null,
                                'order' => $imgIndex,
                            ]);
                        }
                    }
                }
            } else {
                // No sub-albums, create images directly
                if (!empty($data['images'])) {
                    foreach ($data['images'] as $imgIndex => $imgData) {
                        GalleryImage::create([
                            'album_id' => $album->id,
                            'sub_album_id' => null,
                            'virtual_image_id' => $imgData['virtual_image_id'] ?? null,
                            'real_image_id' => $imgData['real_image_id'] ?? null,
                            'order' => $imgIndex,
                        ]);
                    }
                }
            }

            return $album->load(['subAlbums.images', 'images']);
        });
    }

    public function deleteAlbum(int $id): void
    {
        $album = GalleryAlbum::findOrFail($id);
        $album->delete();
    }

    public function getSubAlbumBySlug(int $albumId, string $subAlbumSlug)
    {
        return GallerySubAlbum::with('images')
            ->where('album_id', $albumId)
            ->where('slug', $subAlbumSlug)
            ->firstOrFail();
    }
}
