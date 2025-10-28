<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\LayoutService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FooterLinkController extends Controller
{
    public function __construct(protected LayoutService $layoutService) {}

    public function index()
    {
        $links = $this->layoutService->getAllFooterLinks();
        return Inertia::render('Layout/FooterLinks/Index', ['links' => $links]);
    }

    public function create()
    {
        return Inertia::render('Layout/FooterLinks/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'order' => 'nullable|integer',
        ]);

        try {
            $this->layoutService->createFooterLink($validated);
            return redirect()->route('footer-links.index')->with('success', 'Link created successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to create: ' . $e->getMessage()])->withInput();
        }
    }

    public function edit(int $id)
    {
        $link = $this->layoutService->getFooterLinkForAdmin($id);
        return Inertia::render('Layout/FooterLinks/Edit', ['link' => $link]);
    }

    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'order' => 'nullable|integer',
        ]);

        try {
            $this->layoutService->updateFooterLink($id, $validated);
            return redirect()->route('footer-links.index')->with('success', 'Link updated successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to update: ' . $e->getMessage()])->withInput();
        }
    }

    public function destroy(int $id)
    {
        try {
            $this->layoutService->deleteFooterLink($id);
            return redirect()->route('footer-links.index')->with('success', 'Link deleted successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to delete']);
        }
    }
}
