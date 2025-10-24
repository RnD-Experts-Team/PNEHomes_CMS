<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\TeamService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeamSettingsController extends Controller
{
    public function __construct(
        protected TeamService $teamService
    ) {}

    public function edit()
    {
        $settings = $this->teamService->getSettings();

        return Inertia::render('Team/Settings', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'cover_image_id' => 'required|string',
            'slogan' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'contact_title' => 'nullable|string|max:255',
            'contact_message' => 'nullable|string',
        ]);

        try {
            $this->teamService->updateSettings($validated);

            return redirect()
                ->route('team-settings.edit')
                ->with('success', 'Team settings updated successfully');
        } catch (\Exception $e) {
            return back()
                ->withErrors(['error' => 'Failed to update settings: ' . $e->getMessage()])
                ->withInput();
        }
    }
}
