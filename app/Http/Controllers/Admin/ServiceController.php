<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\ServiceService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServiceController extends Controller
{
    public function __construct(
        protected ServiceService $serviceService
    ) {
    }

    public function index()
    {
        $services = $this->serviceService->getAllForAdmin();

        return Inertia::render('Services/Index', [
            'services' => $services,
            'settings' => $this->serviceService->getSettings(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Services/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'slug' => 'nullable|string|unique:services,slug',
            'title' => 'required|string|max:255',
            'sub_title' => 'nullable|string',
            'description' => 'nullable|string',

            // ✅ media contract
            'cover_image_id' => 'nullable|string',
            'cover_image_type' => 'nullable|string|in:image,video',

            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',

            'content_items' => 'required|array|min:1',

            // ✅ media contract inside array
            'content_items.*.image_id' => 'required|string',
            'content_items.*.image_type' => 'required|string|in:image,video',

            'content_items.*.sub_title' => 'required|string|max:255',
            'content_items.*.description' => 'required|string',

            'contact.title' => 'required|string|max:255',
            'contact.message' => 'required|string',
        ]);

        try {
            $this->serviceService->createService($validated);

            return redirect()
                ->route('services.index')
                ->with('success', 'Service created successfully');
        } catch (\Exception $e) {
            return back()
                ->withErrors(['error' => 'Failed to create service: ' . $e->getMessage()])
                ->withInput();
        }
    }

    public function edit(int $id)
    {
        $service = $this->serviceService->getServiceForAdmin($id);

        return Inertia::render('Services/Edit', [
            'service' => $service,
        ]);
    }

    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'slug' => 'nullable|string|unique:services,slug,' . $id,
            'title' => 'required|string|max:255',
            'sub_title' => 'nullable|string',
            'description' => 'nullable|string',

            // ✅ media contract
            'cover_image_id' => 'nullable|string',
            'cover_image_type' => 'nullable|string|in:image,video',

            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',

            'content_items' => 'required|array|min:1',

            // ✅ media contract inside array
            'content_items.*.image_id' => 'required|string',
            'content_items.*.image_type' => 'required|string|in:image,video',

            'content_items.*.sub_title' => 'required|string|max:255',
            'content_items.*.description' => 'required|string',

            'contact.title' => 'required|string|max:255',
            'contact.message' => 'required|string',
        ]);

        try {
            $this->serviceService->updateService($id, $validated);

            return redirect()
                ->route('services.index')
                ->with('success', 'Service updated successfully');
        } catch (\Exception $e) {
            return back()
                ->withErrors(['error' => 'Failed to update service: ' . $e->getMessage()])
                ->withInput();
        }
    }

    public function destroy(int $id)
    {
        try {
            $this->serviceService->deleteService($id);

            return redirect()
                ->route('services.index')
                ->with('success', 'Service deleted successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to delete service']);
        }
    }


    public function updateSettings(Request $request)
    {
        $validated = $request->validate([
            'image_id' => ['required', 'string'],
            'image_type' => ['required', 'string', 'in:image,video'], // ✅ added
        ]);

        $this->serviceService->updateSettings($validated);
    }
}
