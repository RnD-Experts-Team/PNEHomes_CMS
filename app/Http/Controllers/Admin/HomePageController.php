<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\HomeService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomePageController extends Controller
{
    public function __construct(
        protected HomeService $homeService
    ) {}

    public function index()
    {
        $homeData = $this->homeService->getHomeData();

        return Inertia::render('Home/Index', [
            'homeData' => $homeData,
        ]);
    }

    public function updateFirstSection(Request $request)
    {
        $validated = $request->validate([
            'video_id' => 'required|string',
            'mobile_cover_image_id' => 'required|string',
            'logo_image_id' => 'required|string',
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'book_button_text' => 'nullable|string|max:255',
        ]);

        try {
            $this->homeService->updateFirstSection($validated);
            return back()->with('success', 'First section updated successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to update: ' . $e->getMessage()]);
        }
    }

    public function updateHero(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
        ]);

        try {
            $this->homeService->updateHero($validated);
            return back()->with('success', 'Hero updated successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to update: ' . $e->getMessage()]);
        }
    }

    public function updateServices(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'cover_image_id' => 'required|string',
            'description' => 'nullable|string',
        ]);

        try {
            $this->homeService->updateServices($validated);
            return back()->with('success', 'Services section updated successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to update: ' . $e->getMessage()]);
        }
    }

    public function updateGridSection(Request $request)
    {
        $validated = $request->validate([
            'video_id' => 'required|string',
            'logo_image_id' => 'required|string',
        ]);

        try {
            $this->homeService->updateGridSection($validated);
            return back()->with('success', 'Grid section updated successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to update: ' . $e->getMessage()]);
        }
    }

    public function updateSettings(Request $request)
    {
        $validated = $request->validate([
            'contact_title' => 'required|string|max:255',
        ]);

        try {
            $this->homeService->updateSettings($validated);
            return back()->with('success', 'Settings updated successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to update: ' . $e->getMessage()]);
        }
    }
}
