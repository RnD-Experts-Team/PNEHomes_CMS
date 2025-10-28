<?php

// app/Http/Controllers/Admin/CommunitiesFloorplansController.php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CommunitiesFloorplan;
use App\Models\Community;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CommunitiesFloorplansController extends Controller
{
    public function index()
    {
        $floorplans = CommunitiesFloorplan::with('community')
            ->orderBy('order')->get();

        return Inertia::render('Communities/Floorplans/Index', [
            'floorplans' => $floorplans->map(fn($p) => [
                'id' => $p->id,
                'title' => $p->title,
                'slug' => $p->slug,
                'community' => ['id' => $p->community->id, 'title' => $p->community->title],
                'order' => $p->order,
                'is_active' => $p->is_active,
            ]),
        ]);
    }

    public function create()
    {
        return Inertia::render('Communities/Floorplans/Create', [
            'communities' => Community::orderBy('title')->get(['id','title']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'community_id' => 'required|exists:communities,id',
            'title' => 'required|string|max:255',
            'cover_image_id' => 'required|string',
            'status' => 'nullable|string|max:255',
            'price' => 'nullable|string|max:255',
            'beds' => 'nullable|string|max:255',
            'baths' => 'nullable|string|max:255',
            'garages' => 'nullable|string|max:255',
            'sqft' => 'nullable|string|max:255',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        CommunitiesFloorplan::create([
            ...$validated,
            // slug is auto-generated in model boot, no input
        ]);

        return redirect()->route('communities-floorplans.index')->with('success','Floorplan created');
    }

    public function edit(int $id)
    {
        $plan = CommunitiesFloorplan::findOrFail($id);

        return Inertia::render('Communities/Floorplans/Edit', [
            'floorplan' => $plan,
            'communities' => Community::orderBy('title')->get(['id','title']),
        ]);
    }

    public function update(Request $request, int $id)
    {
        $plan = CommunitiesFloorplan::findOrFail($id);

        $validated = $request->validate([
            'community_id' => 'required|exists:communities,id',
            'title' => 'required|string|max:255',
            'cover_image_id' => 'required|string',
            'status' => 'nullable|string|max:255',
            'price' => 'nullable|string|max:255',
            'beds' => 'nullable|string|max:255',
            'baths' => 'nullable|string|max:255',
            'garages' => 'nullable|string|max:255',
            'sqft' => 'nullable|string|max:255',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $plan->update([
            ...$validated,
            // regenerate slug if title changed
            'slug' => Str::slug($validated['title']),
        ]);

        return redirect()->route('communities-floorplans.index')->with('success','Floorplan updated');
    }

    public function destroy(int $id)
    {
        CommunitiesFloorplan::findOrFail($id)->delete();
        return back()->with('success','Floorplan deleted');
    }
}
