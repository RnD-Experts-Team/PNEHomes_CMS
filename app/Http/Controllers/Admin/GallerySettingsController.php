<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\GalleryService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GallerySettingsController extends Controller
{
    public function __construct(protected GalleryService $service)
    {
    }

    public function edit()
    {
        $settings = $this->service->getSettings();

        return Inertia::render('Gallery/Settings', [
            'settings' => [
                'title' => $settings->title,
                'cover_image_id' => $settings->cover_image_id,
                'cover_image_type' => $settings->cover_image_type,
                'contact_title' => $settings->contact_title,
                'contact_message' => $settings->contact_message,
            ],
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'cover_image_id' => 'required|string',
            'cover_image_type' => 'required|string|in:image,video',
            'contact_title' => 'required|string|max:255',
            'contact_message' => 'required|string',
        ]);

        $this->service->updateSettings($validated);

        return redirect()->route('gallery-albums.index')->with('success', 'Settings updated');
    }
}
