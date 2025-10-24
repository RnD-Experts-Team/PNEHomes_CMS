<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\HomeService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeGridLinkController extends Controller
{
    public function __construct(protected HomeService $homeService) {}

    public function index()
    {
        $links = $this->homeService->getAllGridLinks();
        return Inertia::render('Home/GridLinks/Index', ['links' => $links]);
    }

    public function create()
    {
        return Inertia::render('Home/GridLinks/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'cover_image_id' => 'required|string',
            'order' => 'nullable|integer',
        ]);

        try {
            $this->homeService->createGridLink($validated);
            return redirect()->route('home-grid-links.index')->with('success', 'Link created successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to create: ' . $e->getMessage()])->withInput();
        }
    }

    public function edit(int $id)
    {
        $link = $this->homeService->getGridLinkForAdmin($id);
        return Inertia::render('Home/GridLinks/Edit', ['link' => $link]);
    }

    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'cover_image_id' => 'required|string',
            'order' => 'nullable|integer',
        ]);

        try {
            $this->homeService->updateGridLink($id, $validated);
            return redirect()->route('home-grid-links.index')->with('success', 'Link updated successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to update: ' . $e->getMessage()])->withInput();
        }
    }

    public function destroy(int $id)
    {
        try {
            $this->homeService->deleteGridLink($id);
            return redirect()->route('home-grid-links.index')->with('success', 'Link deleted successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to delete']);
        }
    }
}
