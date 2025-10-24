<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\BuildingOptionsService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BuildingOptionController extends Controller
{
    public function __construct(
        protected BuildingOptionsService $buildingOptionsService
    ) {}

    public function index()
    {
        $options = $this->buildingOptionsService->getAllOptionsForAdmin();

        return Inertia::render('BuildingOptions/Index', [
            'options' => $options,
        ]);
    }

    public function create()
    {
        return Inertia::render('BuildingOptions/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'section_image_id' => 'required|string',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        try {
            $this->buildingOptionsService->createOption($validated);

            return redirect()
                ->route('building-options.index')
                ->with('success', 'Building option created successfully');
        } catch (\Exception $e) {
            return back()
                ->withErrors(['error' => 'Failed to create building option: ' . $e->getMessage()])
                ->withInput();
        }
    }

    public function edit(int $id)
    {
        $option = $this->buildingOptionsService->getOptionForAdmin($id);

        return Inertia::render('BuildingOptions/Edit', [
            'option' => $option,
        ]);
    }

    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'section_image_id' => 'required|string',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        try {
            $this->buildingOptionsService->updateOption($id, $validated);

            return redirect()
                ->route('building-options.index')
                ->with('success', 'Building option updated successfully');
        } catch (\Exception $e) {
            return back()
                ->withErrors(['error' => 'Failed to update building option: ' . $e->getMessage()])
                ->withInput();
        }
    }

    public function destroy(int $id)
    {
        try {
            $this->buildingOptionsService->deleteOption($id);

            return redirect()
                ->route('building-options.index')
                ->with('success', 'Building option deleted successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to delete building option']);
        }
    }
}
