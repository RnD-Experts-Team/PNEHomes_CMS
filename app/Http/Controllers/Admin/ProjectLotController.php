<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\ProjectService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectLotController extends Controller
{
    public function __construct(protected ProjectService $service)
    {
    }

    public function index()
    {
        $lots = $this->service->getAllLotsForAdmin();

        return Inertia::render('Projects/Index', [
            'lots' => $lots->map(fn($l) => [
                'id' => $l->id,
                'title' => $l->title,
                'slug' => $l->slug,
                'has_rooms' => $l->has_rooms,
                'order' => $l->order,
                'is_active' => $l->is_active,
            ]),
        ]);
    }

    public function create()
    {
        return Inertia::render('Projects/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'cover_image_id' => 'required|string',
            'cover_image_type' => 'required|string|in:image,video',
            'has_rooms' => 'nullable|boolean',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
            'rooms' => 'nullable|array',
            'rooms.*.title' => 'required|string|max:255',
            'rooms.*.cover_image_id' => 'required|string',
            'rooms.*.cover_image_type' => 'required|string|in:image,video',
            'rooms.*.images' => 'nullable|array',
            'rooms.*.images.*.virtual_image_id' => 'nullable|string',
            'rooms.*.images.*.virtual_image_type' => 'nullable|string|in:image,video',
            'rooms.*.images.*.real_image_id' => 'nullable|string',
            'rooms.*.images.*.real_image_type' => 'nullable|string|in:image,video',
            'images' => 'nullable|array',
            'images.*.virtual_image_id' => 'nullable|string',
            'images.*.virtual_image_type' => 'nullable|string|in:image,video',
            'images.*.real_image_id' => 'nullable|string',
            'images.*.real_image_type' => 'nullable|string|in:image,video',
        ]);

        $this->service->createLot($validated);

        return redirect()->route('project-lots.index')->with('success', 'Lot created');
    }

    public function edit(int $id)
    {
        $lot = $this->service->getLotForAdmin($id);

        return Inertia::render('Projects/Edit', [
            'lot' => [
                'id' => $lot->id,
                'title' => $lot->title,
                'slug' => $lot->slug,
                'cover_image_id' => $lot->cover_image_id,
                'cover_image_type' => $lot->cover_image_type,
                'has_rooms' => $lot->has_rooms,
                'order' => $lot->order,
                'is_active' => $lot->is_active,
                'rooms' => $lot->rooms->map(fn($room) => [
                    'title' => $room->title,
                    'cover_image_id' => $room->cover_image_id,
                    'cover_image_type' => $room->cover_image_type,
                    'images' => $room->images->map(fn($img) => [
                        'virtual_image_id' => $img->virtual_image_id,
                        'virtual_image_type' => $img->virtual_image_type,
                        'real_image_id' => $img->real_image_id,
                        'real_image_type' => $img->real_image_type,
                    ])->toArray(),
                ])->toArray(),
                'images' => $lot->images->map(fn($img) => [
                    'virtual_image_id' => $img->virtual_image_id,
                    'virtual_image_type' => $img->virtual_image_type,
                    'real_image_id' => $img->real_image_id,
                    'real_image_type' => $img->real_image_type,
                ])->toArray(),
            ],
        ]);
    }

    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'cover_image_id' => 'required|string',
            'cover_image_type' => 'required|string|in:image,video',
            'has_rooms' => 'nullable|boolean',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
            'rooms' => 'nullable|array',
            'rooms.*.title' => 'required|string|max:255',
            'rooms.*.cover_image_id' => 'required|string',
            'rooms.*.cover_image_type' => 'required|string|in:image,video',
            'rooms.*.images' => 'nullable|array',
            'rooms.*.images.*.virtual_image_id' => 'nullable|string',
            'rooms.*.images.*.virtual_image_type' => 'nullable|string|in:image,video',
            'rooms.*.images.*.real_image_id' => 'nullable|string',
            'rooms.*.images.*.real_image_type' => 'nullable|string|in:image,video',

            'images' => 'nullable|array',
            'images.*.virtual_image_id' => 'nullable|string',
            'images.*.virtual_image_type' => 'nullable|string|in:image,video',
            'images.*.real_image_id' => 'nullable|string',
            'images.*.real_image_type' => 'nullable|string|in:image,video',

        ]);

        $this->service->updateLot($id, $validated);

        return redirect()->route('project-lots.index')->with('success', 'Lot updated');
    }

    public function destroy(int $id)
    {
        $this->service->deleteLot($id);
        return back()->with('success', 'Lot deleted');
    }
}
