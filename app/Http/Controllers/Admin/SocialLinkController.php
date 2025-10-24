<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\LayoutService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SocialLinkController extends Controller
{
    public function __construct(protected LayoutService $layoutService) {}

    public function index()
    {
        $links = $this->layoutService->getAllSocialLinks();
        return Inertia::render('Layout/SocialLinks/Index', ['links' => $links]);
    }

    public function create()
    {
        return Inertia::render('Layout/SocialLinks/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'platform' => 'required|in:facebook,instagram,youtube,twitter,linkedin',
            'url' => 'required|url',
            'order' => 'nullable|integer',
        ]);

        try {
            $this->layoutService->createSocialLink($validated);
            return redirect()->route('social-links.index')->with('success', 'Link created successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to create: ' . $e->getMessage()])->withInput();
        }
    }

    public function edit(int $id)
    {
        $link = $this->layoutService->getSocialLinkForAdmin($id);
        return Inertia::render('Layout/SocialLinks/Edit', ['link' => $link]);
    }

    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'platform' => 'required|in:facebook,instagram,youtube,twitter,linkedin',
            'url' => 'required|url',
            'order' => 'nullable|integer',
        ]);

        try {
            $this->layoutService->updateSocialLink($id, $validated);
            return redirect()->route('social-links.index')->with('success', 'Link updated successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to update: ' . $e->getMessage()])->withInput();
        }
    }

    public function destroy(int $id)
    {
        try {
            $this->layoutService->deleteSocialLink($id);
            return redirect()->route('social-links.index')->with('success', 'Link deleted successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to delete']);
        }
    }
}
