<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\EventService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventSettingsController extends Controller
{
    public function __construct(
        protected EventService $eventService
    ) {}

    public function edit()
    {
        $settings = $this->eventService->getSettings();

        return Inertia::render('Events/Settings', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'cover_image_id' => 'required|string',
            'slogan' => 'required|string|max:255',
            'contact_title' => 'nullable|string|max:255',
            'contact_message' => 'nullable|string',
            'title' => 'required|string',
        ]);

        try {
            $this->eventService->updateSettings($validated);

            return redirect()
                ->route('event-settings.edit')
                ->with('success', 'Event settings updated successfully');
        } catch (\Exception $e) {
            return back()
                ->withErrors(['error' => 'Failed to update settings: ' . $e->getMessage()])
                ->withInput();
        }
    }
}
