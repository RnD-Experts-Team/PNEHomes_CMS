<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\LayoutService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LayoutController extends Controller
{
    public function __construct(protected LayoutService $layoutService) {}

    public function index()
    {
        $layoutData = $this->layoutService->getLayoutData();

        return Inertia::render('Layout/Index', [
            'layoutData' => $layoutData,
        ]);
    }

    public function updateNavigation(Request $request)
    {
        $validated = $request->validate([
            'logo_image_id' => 'required|string',
        ]);

        try {
            $this->layoutService->updateNavigation($validated);
            return back()->with('success', 'Navigation updated successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to update: ' . $e->getMessage()]);
        }
    }

    public function updateContactInfo(Request $request)
    {
        $validated = $request->validate([
            'phone' => 'nullable|string|max:255',
        ]);

        try {
            $this->layoutService->updateContactInfo($validated);
            return back()->with('success', 'Contact info updated successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to update: ' . $e->getMessage()]);
        }
    }

     /**
     * Update the Contact Info used in the NAVIGATION (header).
     */
    public function updateContactInfoNavigation(Request $request)
    {
        $validated = $request->validate([
            'phone'  => ['nullable','string','max:32','regex:/^\d+$/'],
            'button' => ['nullable','string','max:255'],
        ], [
            'phone.regex' => 'Phone must contain digits only.',
        ]);

        try {
            $this->layoutService->updateContactInfoNavigation($validated);
            return back()->with('success', 'Header contact info updated successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to update: ' . $e->getMessage()]);
        }
    }
}
