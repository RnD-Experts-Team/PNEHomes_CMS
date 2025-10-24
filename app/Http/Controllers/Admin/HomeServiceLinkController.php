<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\HomeService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeServiceLinkController extends Controller
{
    public function __construct(protected HomeService $homeService) {}

    public function index()
    {
        $links = $this->homeService->getAllServiceLinks();
        return Inertia::render('Home/ServiceLinks/Index', ['links' => $links]);
    }

    public function create()
    {
        return Inertia::render('Home/ServiceLinks/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255',
            'order' => 'nullable|integer',
        ]);

        try {
            $this->homeService->createServiceLink($validated);
            return redirect()->route('home-service-links.index')->with('success', 'Link created successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to create: ' . $e->getMessage()])->withInput();
        }
    }

    public function edit(int $id)
    {
        $link = $this->homeService->getServiceLinkForAdmin($id);
        return Inertia::render('Home/ServiceLinks/Edit', ['link' => $link]);
    }

    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255',
            'order' => 'nullable|integer',
        ]);

        try {
            $this->homeService->updateServiceLink($id, $validated);
            return redirect()->route('home-service-links.index')->with('success', 'Link updated successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to update: ' . $e->getMessage()])->withInput();
        }
    }

    public function destroy(int $id)
    {
        try {
            $this->homeService->deleteServiceLink($id);
            return redirect()->route('home-service-links.index')->with('success', 'Link deleted successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to delete']);
        }
    }
}
