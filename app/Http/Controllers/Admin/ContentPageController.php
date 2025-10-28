<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\ContentPageService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContentPageController extends Controller
{
    public function __construct(
        protected ContentPageService $contentPageService
    ) {}

    // About Us
    public function aboutUs()
    {
        $aboutUs = $this->contentPageService->getAboutUs();

        return Inertia::render('ContentPages/AboutUs', [
            'aboutUs' => $aboutUs,
        ]);
    }

    public function updateAboutUs(Request $request)
    {
        $validated = $request->validate([
            'cover_image_id' => 'required|string',
            'slogan' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        try {
            $this->contentPageService->updateAboutUs($validated);
            return back()->with('success', 'About Us page updated successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to update: ' . $e->getMessage()]);
        }
    }

    // Privacy Policy
    public function privacyPolicy()
    {
        $privacyPolicy = $this->contentPageService->getPrivacyPolicy();

        return Inertia::render('ContentPages/PrivacyPolicy', [
            'privacyPolicy' => [
                'title' => $privacyPolicy->title,
                'slogan' => $privacyPolicy->slogan,
                'description' => $privacyPolicy->description,
                'cover_image_id' => $privacyPolicy->cover_image_id,
                'contact_title' => $privacyPolicy->contact_title,
                'contact_message' => $privacyPolicy->contact_message,
            ],
        ]);
    }

    public function updatePrivacyPolicy(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slogan' => 'required|string|max:255',
            'description' => 'nullable|string',
            'cover_image_id' => 'required|string',
            'contact_title' => 'required|string|max:255',
            'contact_message' => 'required|string',
        ]);

        try {
            $this->contentPageService->updatePrivacyPolicy($validated);
            return back()->with('success', 'Privacy Policy updated successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to update: ' . $e->getMessage()]);
        }
    }
}
