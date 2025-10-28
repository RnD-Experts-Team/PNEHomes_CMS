<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\CommunityService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CommunityController extends Controller
{
    public function __construct(
        protected CommunityService $communityService
    ) {}

    public function index()
    {
        $communities = $this->communityService->getAllForAdmin();

        return Inertia::render('Communities/Index', [
            'communities' => $communities,
        ]);
    }

    public function create()
    {
        return Inertia::render('Communities/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            // slug removed - auto-generated from title
            'title' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'address' => 'required|string',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'card_image_id' => 'required|string',
            'video_id' => 'nullable|string',
            'community_features' => 'nullable|string',
            'starting_price' => 'required|string|max:255',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
            'gallery' => 'nullable|array',
            'gallery.*' => 'required|string',
        ]);

        try {
            $this->communityService->createCommunity($validated);

            return redirect()
                ->route('communities.index')
                ->with('success', 'Community created successfully');
        } catch (\Exception $e) {
            return back()
                ->withErrors(['error' => 'Failed to create community: ' . $e->getMessage()])
                ->withInput();
        }
    }

    public function edit(int $id)
    {
        $community = $this->communityService->getCommunityForAdmin($id);

        return Inertia::render('Communities/Edit', [
            'community' => $community,
        ]);
    }

    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            // slug removed - auto-generated from title
            'title' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'address' => 'required|string',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'card_image_id' => 'required|string',
            'video_id' => 'nullable|string',
            'community_features' => 'nullable|string',
            'starting_price' => 'required|string|max:255',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
            'gallery' => 'nullable|array',
            'gallery.*' => 'required|string',
        ]);

        try {
            $this->communityService->updateCommunity($id, $validated);

            return redirect()
                ->route('communities.index')
                ->with('success', 'Community updated successfully');
        } catch (\Exception $e) {
            return back()
                ->withErrors(['error' => 'Failed to update community: ' . $e->getMessage()])
                ->withInput();
        }
    }

    public function destroy(int $id)
    {
        try {
            $this->communityService->deleteCommunity($id);

            return redirect()
                ->route('communities.index')
                ->with('success', 'Community deleted successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to delete community']);
        }
    }
}
