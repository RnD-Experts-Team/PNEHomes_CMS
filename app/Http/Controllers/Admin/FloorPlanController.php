<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\FloorPlanService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FloorPlanController extends Controller
{
    public function __construct(
        protected FloorPlanService $floorPlanService
    ) {}

    public function index()
    {
        $floorPlans = $this->floorPlanService->getAllFloorPlansForAdmin();
        return Inertia::render('FloorPlans/Index', [
            'floorPlans' => $floorPlans,
        ]);
    }

    public function create()
    {
        return Inertia::render('FloorPlans/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'slug' => 'nullable|string|unique:floor_plans,slug',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image_id' => 'required|string',
            'bedroom' => 'required|integer|min:0',
            'bathroom' => 'required|integer|min:0',
            'floor' => 'required|integer|min:0',
            'area' => 'required|integer|min:0',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        try {
            $this->floorPlanService->createFloorPlan($validated);

            return redirect()
                ->route('floor-plans.index')
                ->with('success', 'Floor plan created successfully');
        } catch (\Exception $e) {
            return back()
                ->withErrors(['error' => 'Failed to create floor plan: ' . $e->getMessage()])
                ->withInput();
        }
    }

    public function edit(int $id)
    {
        $floorPlan = $this->floorPlanService->getFloorPlanForAdmin($id);

        return Inertia::render('FloorPlans/Edit', [
            'floorPlan' => $floorPlan,
        ]);
    }

    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'slug' => 'nullable|string|unique:floor_plans,slug,' . $id,
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image_id' => 'required|string',
            'bedroom' => 'required|integer|min:0',
            'bathroom' => 'required|integer|min:0',
            'floor' => 'required|integer|min:0',
            'area' => 'required|integer|min:0',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        try {
            $this->floorPlanService->updateFloorPlan($id, $validated);

            return redirect()
                ->route('floor-plans.index')
                ->with('success', 'Floor plan updated successfully');
        } catch (\Exception $e) {
            return back()
                ->withErrors(['error' => 'Failed to update floor plan: ' . $e->getMessage()])
                ->withInput();
        }
    }

    public function destroy(int $id)
    {
        try {
            $this->floorPlanService->deleteFloorPlan($id);

            return redirect()
                ->route('floor-plans.index')
                ->with('success', 'Floor plan deleted successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to delete floor plan']);
        }
    }
}
