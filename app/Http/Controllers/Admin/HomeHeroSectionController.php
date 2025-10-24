<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\HomeService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeHeroSectionController extends Controller
{
    public function __construct(protected HomeService $homeService) {}

    public function index()
    {
        $sections = $this->homeService->getAllHeroSections();
        return Inertia::render('Home/HeroSections/Index', ['sections' => $sections]);
    }

    public function create()
    {
        return Inertia::render('Home/HeroSections/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'icon' => 'required|in:date,pen,home',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'order' => 'nullable|integer',
        ]);

        try {
            $this->homeService->createHeroSection($validated);
            return redirect()->route('home-hero-sections.index')->with('success', 'Section created successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to create: ' . $e->getMessage()])->withInput();
        }
    }

    public function edit(int $id)
    {
        $section = $this->homeService->getHeroSectionForAdmin($id);
        return Inertia::render('Home/HeroSections/Edit', ['section' => $section]);
    }

    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'icon' => 'required|in:date,pen,home',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'order' => 'nullable|integer',
        ]);

        try {
            $this->homeService->updateHeroSection($id, $validated);
            return redirect()->route('home-hero-sections.index')->with('success', 'Section updated successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to update: ' . $e->getMessage()])->withInput();
        }
    }

    public function destroy(int $id)
    {
        try {
            $this->homeService->deleteHeroSection($id);
            return redirect()->route('home-hero-sections.index')->with('success', 'Section deleted successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to delete']);
        }
    }
}
