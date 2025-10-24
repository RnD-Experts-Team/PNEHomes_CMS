<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\BuildingOptionsService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BuildingOptionsSettingsController extends Controller
{
    public function __construct(
        protected BuildingOptionsService $buildingOptionsService
    ) {}

    public function edit()
    {
        $settings = $this->buildingOptionsService->getSettings();

        return Inertia::render('BuildingOptions/Settings', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'cover_image_id' => 'required|string',
            'articles_cover_image_id' => 'required|string',
            'slogan' => 'required|string|max:255',
            'title' => 'required|string|max:255',
        ]);

        try {
            $this->buildingOptionsService->updateSettings($validated);

            return redirect()
                ->route('building-options-settings.edit')
                ->with('success', 'Settings updated successfully');
        } catch (\Exception $e) {
            return back()
                ->withErrors(['error' => 'Failed to update settings: ' . $e->getMessage()])
                ->withInput();
        }
    }
}
