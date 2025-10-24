<?php

namespace App\Services;

use App\Models\GalleryAlbum;
use App\Models\GallerySubAlbum;
use App\Models\GalleryImage;
use App\Models\GalleryContact;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class GalleryService
{
    public function getAllAlbums()
    {
        return GalleryAlbum::with(['subAlbums', 'images'])
            ->where('is_active', true)
            ->orderBy('order')
            ->get();
    }

    public function getAlbumBySlug(string $slug)
    {
        return GalleryAlbum::with(['subAlbums', 'images'])
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();
    }

    public function getSubAlbumBySlug(string $albumSlug, string $subAlbumSlug)
    {
        $album = GalleryAlbum::where('slug', $albumSlug)
            ->where('is_active', true)
            ->firstOrFail();

        return GallerySubAlbum::with('images')
            ->where('album_id', $album->id)
            ->where('slug', $subAlbumSlug)
            ->firstOrFail();
    }

    public function getAllAlbumsForAdmin()
    {
        return GalleryAlbum::withCount(['subAlbums', 'images'])
            ->orderBy('order')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getAlbumForAdmin(int $id)
    {
        return GalleryAlbum::with(['subAlbums', 'images'])->findOrFail($id);
    }

    public function createAlbum(array $data): GalleryAlbum
    {
        return DB::transaction(function () use ($data) {
            if (empty($data['slug'])) {
                $data['slug'] = Str::slug($data['title']);
            }

            $album = GalleryAlbum::create([
                'slug' => $data['slug'],
                'title' => $data['title'],
                'cover_virtual_image_id' => $data['cover_virtual_image_id'],
                'cover_real_image_id' => $data['cover_real_image_id'],
                'has_sub_albums' => $data['has_sub_albums'] ?? false,
                'order' => $data['order'] ?? 0,
                'is_active' => $data['is_active'] ?? true,
            ]);

            // Create sub-albums if provided
            if (!empty($data['sub_albums']) && $data['has_sub_albums']) {
                foreach ($data['sub_albums'] as $index => $subAlbumData) {
                    $subAlbum = GallerySubAlbum::create([
                        'album_id' => $album->id,
                        'slug' => $subAlbumData['slug'] ?? Str::slug($subAlbumData['title']),
                        'title' => $subAlbumData['title'],
                        'cover_virtual_image_id' => $subAlbumData['cover_virtual_image_id'],
                        'cover_real_image_id' => $subAlbumData['cover_real_image_id'],
                        'order' => $index,
                    ]);

                    // Create images for sub-album
                    if (!empty($subAlbumData['images'])) {
                        foreach ($subAlbumData['images'] as $imgIndex => $imageData) {
                            GalleryImage::create([
                                'album_id' => $album->id,
                                'sub_album_id' => $subAlbum->id,
                                'virtual_image_id' => $imageData['virtual_image_id'],
                                'real_image_id' => $imageData['real_image_id'],
                                'order' => $imgIndex,
                            ]);
                        }
                    }
                }
            } else {
                // Create images directly for album
                if (!empty($data['images'])) {
                    foreach ($data['images'] as $index => $imageData) {
                        GalleryImage::create([
                            'album_id' => $album->id,
                            'sub_album_id' => null,
                            'virtual_image_id' => $imageData['virtual_image_id'],
                            'real_image_id' => $imageData['real_image_id'],
                            'order' => $index,
                        ]);
                    }
                }
            }

            return $album->load(['subAlbums', 'images']);
        });
    }

    public function updateAlbum(int $id, array $data): GalleryAlbum
    {
        return DB::transaction(function () use ($id, $data) {
            $album = GalleryAlbum::findOrFail($id);

            if (empty($data['slug']) && isset($data['title'])) {
                $data['slug'] = Str::slug($data['title']);
            }

            $album->update([
                'slug' => $data['slug'] ?? $album->slug,
                'title' => $data['title'] ?? $album->title,
                'cover_virtual_image_id' => $data['cover_virtual_image_id'] ?? $album->cover_virtual_image_id,
                'cover_real_image_id' => $data['cover_real_image_id'] ?? $album->cover_real_image_id,
                'has_sub_albums' => $data['has_sub_albums'] ?? $album->has_sub_albums,
                'order' => $data['order'] ?? $album->order,
                'is_active' => $data['is_active'] ?? $album->is_active,
            ]);

            // Update sub-albums
            if (isset($data['sub_albums']) && $data['has_sub_albums']) {
                $album->subAlbums()->delete();
                foreach ($data['sub_albums'] as $index => $subAlbumData) {
                    $subAlbum = GallerySubAlbum::create([
                        'album_id' => $album->id,
                        'slug' => $subAlbumData['slug'] ?? Str::slug($subAlbumData['title']),
                        'title' => $subAlbumData['title'],
                        'cover_virtual_image_id' => $subAlbumData['cover_virtual_image_id'],
                        'cover_real_image_id' => $subAlbumData['cover_real_image_id'],
                        'order' => $index,
                    ]);

                    if (!empty($subAlbumData['images'])) {
                        foreach ($subAlbumData['images'] as $imgIndex => $imageData) {
                            GalleryImage::create([
                                'album_id' => $album->id,
                                'sub_album_id' => $subAlbum->id,
                                'virtual_image_id' => $imageData['virtual_image_id'],
                                'real_image_id' => $imageData['real_image_id'],
                                'order' => $imgIndex,
                            ]);
                        }
                    }
                }
            } else {
                // Update images directly for album
                if (isset($data['images'])) {
                    $album->images()->delete();
                    foreach ($data['images'] as $index => $imageData) {
                        GalleryImage::create([
                            'album_id' => $album->id,
                            'sub_album_id' => null,
                            'virtual_image_id' => $imageData['virtual_image_id'],
                            'real_image_id' => $imageData['real_image_id'],
                            'order' => $index,
                        ]);
                    }
                }
            }

            return $album->load(['subAlbums', 'images']);
        });
    }

    public function deleteAlbum(int $id): void
    {
        $album = GalleryAlbum::findOrFail($id);
        $album->delete();
    }

    public function getContact()
    {
        return GalleryContact::first();
    }
}
