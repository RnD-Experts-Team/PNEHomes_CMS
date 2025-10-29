<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\PropertyService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PropertyController extends Controller
{
    public function __construct(protected PropertyService $service) {}

    public function index()
    {
        $properties = $this->service->getAllForAdmin();

        return Inertia::render('Properties/Index', [
            'properties' => $properties->map(fn($p) => [
                'id' => $p->id,
                'title' => $p->title,
                'slug' => $p->slug,
                'community' => $p->community,
                'price' => $p->price,
                'beds' => $p->beds,
                'baths' => $p->baths,
                'order' => $p->order,
                'is_active' => $p->is_active,
            ]),
        ]);
    }

    public function create()
    {
        return Inertia::render('Properties/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'community' => 'required|string|max:255',
            'price' => 'required|string|max:255',
            'beds' => 'required|string|max:255',
            'baths' => 'required|string|max:255',
            'garages' => 'required|string|max:255',
            'sqft' => 'required|string|max:255',
            'zillow_link' => 'nullable|url',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
            'gallery' => 'nullable|array',
            'gallery.*' => 'required|string',
            'whats_special.badges' => 'nullable|array',
            'whats_special.badges.*' => 'required|string',
            'whats_special.description' => 'nullable|string',
            'facts_features' => 'nullable|array',
            'facts_features.*.title' => 'required|string',
            'facts_features.*.list' => 'required|array',
            'floor_plans' => 'nullable|array',
            'floor_plans.*.title' => 'required|string',
            'floor_plans.*.image_id' => 'required|string',
            'floor_plans.*.description' => 'nullable|string',
        ]);

        $this->service->createProperty($validated);

        return redirect()->route('properties.index')->with('success', 'Property created');
    }

    public function edit(int $id)
    {
        $property = $this->service->getPropertyForAdmin($id);

        return Inertia::render('Properties/Edit', [
            'property' => [
                'id' => $property->id,
                'title' => $property->title,
                'slug' => $property->slug,
                'community' => $property->community,
                'price' => $property->price,
                'beds' => $property->beds,
                'baths' => $property->baths,
                'garages' => $property->garages,
                'sqft' => $property->sqft,
                'zillow_link' => $property->zillow_link,
                'order' => $property->order,
                'is_active' => $property->is_active,
                'gallery' => $property->gallery->pluck('image_id')->toArray(),
                'whats_special' => $property->whatsSpecial ? [
                    'badges' => $property->whatsSpecial->badges,
                    'description' => $property->whatsSpecial->description,
                ] : ['badges' => [], 'description' => ''],
                'facts_features' => $property->factsFeatures->map(fn($f) => [
                    'title' => $f->title,
                    'list' => $f->list,
                ])->toArray(),
                'floor_plans' => $property->floorPlans->map(fn($fp) => [
                    'title' => $fp->title,
                    'image_id' => $fp->image_id,
                    'description' => $fp->description,
                ])->toArray(),
            ],
        ]);
    }

    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'community' => 'required|string|max:255',
            'price' => 'required|string|max:255',
            'beds' => 'required|string|max:255',
            'baths' => 'required|string|max:255',
            'garages' => 'required|string|max:255',
            'sqft' => 'required|string|max:255',
            'zillow_link' => 'nullable|url',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
            'gallery' => 'nullable|array',
            'gallery.*' => 'required|string',
            'whats_special.badges' => 'nullable|array',
            'whats_special.badges.*' => 'required|string',
            'whats_special.description' => 'nullable|string',
            'facts_features' => 'nullable|array',
            'facts_features.*.title' => 'required|string',
            'facts_features.*.list' => 'required|array',
            'floor_plans' => 'nullable|array',
            'floor_plans.*.title' => 'required|string',
            'floor_plans.*.image_id' => 'required|string',
            'floor_plans.*.description' => 'nullable|string',
        ]);

        $this->service->updateProperty($id, $validated);

        return redirect()->route('properties.index')->with('success', 'Property updated');
    }

    public function destroy(int $id)
    {
        $this->service->deleteProperty($id);
        return back()->with('success', 'Property deleted');
    }
}
