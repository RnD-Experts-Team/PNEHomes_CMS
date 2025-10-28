<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\LayoutService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NavigationLinkController extends Controller
{
    public function __construct(protected LayoutService $layoutService) {}

    public function index()
    {
        $links = $this->layoutService->getAllNavigationLinks();
        return Inertia::render('Layout/NavigationLinks/Index', ['links' => $links]);
    }

    public function create()
    {
        return Inertia::render('Layout/NavigationLinks/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'order' => 'nullable|integer',
        ]);

        try {
            $this->layoutService->createNavigationLink($validated);
            return redirect()->route('navigation-links.index')->with('success', 'Link created successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to create: ' . $e->getMessage()])->withInput();
        }
    }

    public function edit(int $id)
    {
        $link = $this->layoutService->getNavigationLinkForAdmin($id);
        return Inertia::render('Layout/NavigationLinks/Edit', ['link' => $link]);
    }

    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'order' => 'nullable|integer',
        ]);

        try {
            $this->layoutService->updateNavigationLink($id, $validated);
            return redirect()->route('navigation-links.index')->with('success', 'Link updated successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to update: ' . $e->getMessage()])->withInput();
        }
    }

    public function destroy(int $id)
    {
        try {
            $this->layoutService->deleteNavigationLink($id);
            return redirect()->route('navigation-links.index')->with('success', 'Link deleted successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to delete']);
        }
    }
}
