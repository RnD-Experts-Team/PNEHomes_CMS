<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\GalleryService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GalleryAlbumController extends Controller
{
    public function __construct(protected GalleryService $service) {}

    public function index()
    {
        $albums = $this->service->getAllAlbumsForAdmin();

        return Inertia::render('Gallery/Index', [
            'albums' => $albums->map(fn($a) => [
                'id' => $a->id,
                'title' => $a->title,
                'slug' => $a->slug,
                'has_sub_albums' => $a->has_sub_albums,
                'order' => $a->order,
                'is_active' => $a->is_active,
            ]),
        ]);
    }

    public function create()
    {
        return Inertia::render('Gallery/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'cover_image_id' => 'required|string',
            'has_sub_albums' => 'nullable|boolean',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
            'sub_albums' => 'nullable|array',
            'sub_albums.*.title' => 'required|string|max:255',
            'sub_albums.*.cover_image_id' => 'required|string',
            'sub_albums.*.images' => 'nullable|array',
            'sub_albums.*.images.*.virtual_image_id' => 'nullable|string',
            'sub_albums.*.images.*.real_image_id' => 'nullable|string',
            'images' => 'nullable|array',
            'images.*.virtual_image_id' => 'nullable|string',
            'images.*.real_image_id' => 'nullable|string',
        ]);

        $this->service->createAlbum($validated);

        return redirect()->route('gallery-albums.index')->with('success', 'Album created');
    }

    public function edit(int $id)
    {
        $album = $this->service->getAlbumForAdmin($id);

        return Inertia::render('Gallery/Edit', [
            'album' => [
                'id' => $album->id,
                'title' => $album->title,
                'slug' => $album->slug,
                'cover_image_id' => $album->cover_image_id,
                'has_sub_albums' => $album->has_sub_albums,
                'order' => $album->order,
                'is_active' => $album->is_active,
                'sub_albums' => $album->subAlbums->map(fn($sub) => [
                    'title' => $sub->title,
                    'cover_image_id' => $sub->cover_image_id,
                    'images' => $sub->images->map(fn($img) => [
                        'virtual_image_id' => $img->virtual_image_id,
                        'real_image_id' => $img->real_image_id,
                    ])->toArray(),
                ])->toArray(),
                'images' => $album->images->map(fn($img) => [
                    'virtual_image_id' => $img->virtual_image_id,
                    'real_image_id' => $img->real_image_id,
                ])->toArray(),
            ],
        ]);
    }

    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'cover_image_id' => 'required|string',
            'has_sub_albums' => 'nullable|boolean',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
            'sub_albums' => 'nullable|array',
            'sub_albums.*.title' => 'required|string|max:255',
            'sub_albums.*.cover_image_id' => 'required|string',
            'sub_albums.*.images' => 'nullable|array',
            'sub_albums.*.images.*.virtual_image_id' => 'nullable|string',
            'sub_albums.*.images.*.real_image_id' => 'nullable|string',
            'images' => 'nullable|array',
            'images.*.virtual_image_id' => 'nullable|string',
            'images.*.real_image_id' => 'nullable|string',
        ]);

        $this->service->updateAlbum($id, $validated);

        return redirect()->route('gallery-albums.index')->with('success', 'Album updated');
    }

    public function destroy(int $id)
    {
        $this->service->deleteAlbum($id);
        return back()->with('success', 'Album deleted');
    }
}
