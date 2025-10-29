<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\PropertyService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PropertySettingsController extends Controller
{
    public function __construct(protected PropertyService $service) {}

    public function edit()
    {
        $settings = $this->service->getSettings();

        return Inertia::render('Properties/Settings', [
            'settings' => [
                'title' => $settings->title,
                'cover_image_id' => $settings->cover_image_id,
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
            'contact_title' => 'required|string|max:255',
            'contact_message' => 'required|string',
        ]);

        $this->service->updateSettings($validated);

        return redirect()->route('properties.index')->with('success', 'Settings updated');
    }
}
