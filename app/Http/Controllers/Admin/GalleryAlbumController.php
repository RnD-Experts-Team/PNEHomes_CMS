<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\GalleryService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GalleryAlbumController extends Controller
{
    public function __construct(
        protected GalleryService $galleryService
    ) {}

    public function index()
    {
        $albums = $this->galleryService->getAllAlbumsForAdmin();

        return Inertia::render('Gallery/Index', [
            'albums' => $albums,
        ]);
    }

    public function create()
    {
        return Inertia::render('Gallery/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'slug' => 'nullable|string|unique:gallery_albums,slug',
            'title' => 'required|string|max:255',
            'cover_virtual_image_id' => 'required|string',
            'cover_real_image_id' => 'required|string',
            'has_sub_albums' => 'required|boolean',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
            'sub_albums' => 'required_if:has_sub_albums,true|array',
            'sub_albums.*.slug' => 'nullable|string',
            'sub_albums.*.title' => 'required_with:sub_albums|string',
            'sub_albums.*.cover_virtual_image_id' => 'required_with:sub_albums|string',
            'sub_albums.*.cover_real_image_id' => 'required_with:sub_albums|string',
            'sub_albums.*.images' => 'nullable|array',
            'sub_albums.*.images.*.virtual_image_id' => 'required|string',
            'sub_albums.*.images.*.real_image_id' => 'required|string',
            'images' => 'required_if:has_sub_albums,false|array',
            'images.*.virtual_image_id' => 'required|string',
            'images.*.real_image_id' => 'required|string',
        ]);

        try {
            $this->galleryService->createAlbum($validated);

            return redirect()
                ->route('gallery-albums.index')
                ->with('success', 'Gallery album created successfully');
        } catch (\Exception $e) {
            return back()
                ->withErrors(['error' => 'Failed to create album: ' . $e->getMessage()])
                ->withInput();
        }
    }

    public function edit(int $id)
    {
        $album = $this->galleryService->getAlbumForAdmin($id);

        return Inertia::render('Gallery/Edit', [
            'album' => $album,
        ]);
    }

    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'slug' => 'nullable|string|unique:gallery_albums,slug,' . $id,
            'title' => 'required|string|max:255',
            'cover_virtual_image_id' => 'required|string',
            'cover_real_image_id' => 'required|string',
            'has_sub_albums' => 'required|boolean',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
            'sub_albums' => 'required_if:has_sub_albums,true|array',
            'sub_albums.*.slug' => 'nullable|string',
            'sub_albums.*.title' => 'required_with:sub_albums|string',
            'sub_albums.*.cover_virtual_image_id' => 'required_with:sub_albums|string',
            'sub_albums.*.cover_real_image_id' => 'required_with:sub_albums|string',
            'sub_albums.*.images' => 'nullable|array',
            'sub_albums.*.images.*.virtual_image_id' => 'required|string',
            'sub_albums.*.images.*.real_image_id' => 'required|string',
            'images' => 'required_if:has_sub_albums,false|array',
            'images.*.virtual_image_id' => 'required|string',
            'images.*.real_image_id' => 'required|string',
        ]);

        try {
            $this->galleryService->updateAlbum($id, $validated);

            return redirect()
                ->route('gallery-albums.index')
                ->with('success', 'Gallery album updated successfully');
        } catch (\Exception $e) {
            return back()
                ->withErrors(['error' => 'Failed to update album: ' . $e->getMessage()])
                ->withInput();
        }
    }

    public function destroy(int $id)
    {
        try {
            $this->galleryService->deleteAlbum($id);

            return redirect()
                ->route('gallery-albums.index')
                ->with('success', 'Gallery album deleted successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to delete album']);
        }
    }
}
