<?php
// app/Http/Controllers/Admin/CommunitiesSettingsController.php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\CommunityService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class CommunitiesSettingsController extends Controller
{
    public function __construct(protected CommunityService $service) {}

    public function edit()
    {
        $settings = $this->service->getSettings();
        $contact = $this->service->getContact();

        return Inertia::render('Communities/Settings', [
            'settings' => [
                'title' => $settings->title,
                'cover_image_id' => $settings->cover_image_id,
                'zillow_link' => $settings->zillow_link,
            ],
            'contact' => $contact ? [
                'title' => $contact->title,
                'message' => $contact->message,
            ] : [
                'title' => '',
                'message' => '',
            ],
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            // Settings
            'title' => ['required','string','max:255'],
            'cover_image_id' => ['nullable','string'],
            'zillow_link' => ['nullable','url'],

            // Contact (optional, but validate shape)
            'contact.title' => ['required','string','max:255'],
            'contact.message' => ['required','string'],
        ]);

        $settingsData = [
            'title' => $validated['title'] ?? null,
            'cover_image_id' => $validated['cover_image_id'] ?? null,
            'zillow_link' => $validated['zillow_link'] ?? null,
        ];

        $contactData = $validated['contact'] ?? [];

        $this->service->updateSettingsAndContact($settingsData, $contactData);

        return redirect()
            ->route('communities.index')
            ->with('success', 'Settings updated');
    }
}
