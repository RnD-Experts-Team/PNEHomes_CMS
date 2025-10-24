<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\PropertyService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PropertyController extends Controller
{
    public function __construct(
        protected PropertyService $propertyService
    ) {}

    public function index()
    {
        $properties = $this->propertyService->getAllForAdmin();

        return Inertia::render('Properties/Index', [
            'properties' => $properties,
        ]);
    }

    public function create()
    {
        return Inertia::render('Properties/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'slug' => 'nullable|string|unique:properties,slug',
            'title' => 'required|string|max:255',
            'community' => 'required|string|max:255',
            'price' => 'required|string|max:255',
            'beds' => 'required|string|max:255',
            'baths' => 'required|string|max:255',
            'garages' => 'required|string|max:255',
            'sqft' => 'required|string|max:255',
            'zillow_link' => 'nullable|url',
            'next_property_slug' => 'nullable|string',
            'prev_property_slug' => 'nullable|string',
            'cover_image_id' => 'nullable|string',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
            'gallery' => 'nullable|array',
            'gallery.*' => 'required|string',
            'whats_special.badges' => 'nullable|array',
            'whats_special.badges.*' => 'string',
            'whats_special.description' => 'required|string',
            'facts_features' => 'nullable|array',
            'facts_features.*.title' => 'required|string',
            'facts_features.*.list' => 'required|array',
            'facts_features.*.list.*' => 'string',
            'floor_plans' => 'nullable|array',
            'floor_plans.*.title' => 'required|string',
            'floor_plans.*.image_id' => 'required|string',
            'floor_plans.*.description' => 'required|string',
        ]);

        try {
            $this->propertyService->createProperty($validated);

            return redirect()
                ->route('properties.index')
                ->with('success', 'Property created successfully');
        } catch (\Exception $e) {
            return back()
                ->withErrors(['error' => 'Failed to create property: ' . $e->getMessage()])
                ->withInput();
        }
    }

    public function edit(int $id)
    {
        $property = $this->propertyService->getPropertyForAdmin($id);

        return Inertia::render('Properties/Edit', [
            'property' => $property,
        ]);
    }

    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'slug' => 'nullable|string|unique:properties,slug,' . $id,
            'title' => 'required|string|max:255',
            'community' => 'required|string|max:255',
            'price' => 'required|string|max:255',
            'beds' => 'required|string|max:255',
            'baths' => 'required|string|max:255',
            'garages' => 'required|string|max:255',
            'sqft' => 'required|string|max:255',
            'zillow_link' => 'nullable|url',
            'next_property_slug' => 'nullable|string',
            'prev_property_slug' => 'nullable|string',
            'cover_image_id' => 'nullable|string',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
            'gallery' => 'nullable|array',
            'gallery.*' => 'required|string',
            'whats_special.badges' => 'nullable|array',
            'whats_special.badges.*' => 'string',
            'whats_special.description' => 'required|string',
            'facts_features' => 'nullable|array',
            'facts_features.*.title' => 'required|string',
            'facts_features.*.list' => 'required|array',
            'facts_features.*.list.*' => 'string',
            'floor_plans' => 'nullable|array',
            'floor_plans.*.title' => 'required|string',
            'floor_plans.*.image_id' => 'required|string',
            'floor_plans.*.description' => 'required|string',
        ]);

        try {
            $this->propertyService->updateProperty($id, $validated);

            return redirect()
                ->route('properties.index')
                ->with('success', 'Property updated successfully');
        } catch (\Exception $e) {
            return back()
                ->withErrors(['error' => 'Failed to update property: ' . $e->getMessage()])
                ->withInput();
        }
    }

    public function destroy(int $id)
    {
        try {
            $this->propertyService->deleteProperty($id);

            return redirect()
                ->route('properties.index')
                ->with('success', 'Property deleted successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to delete property']);
        }
    }
}
