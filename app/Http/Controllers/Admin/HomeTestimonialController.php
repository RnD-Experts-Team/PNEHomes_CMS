<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\HomeService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeTestimonialController extends Controller
{
    public function __construct(protected HomeService $homeService) {}

    public function index()
    {
        $testimonials = $this->homeService->getAllTestimonials();
        return Inertia::render('Home/Testimonials/Index', ['testimonials' => $testimonials]);
    }

    public function create()
    {
        return Inertia::render('Home/Testimonials/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'description' => 'required|string',
            'by' => 'required|string|max:255',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        try {
            $this->homeService->createTestimonial($validated);
            return redirect()->route('home-testimonials.index')->with('success', 'Testimonial created successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to create: ' . $e->getMessage()])->withInput();
        }
    }

    public function edit(int $id)
    {
        $testimonial = $this->homeService->getTestimonialForAdmin($id);
        return Inertia::render('Home/Testimonials/Edit', ['testimonial' => $testimonial]);
    }

    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'description' => 'required|string',
            'by' => 'required|string|max:255',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        try {
            $this->homeService->updateTestimonial($id, $validated);
            return redirect()->route('home-testimonials.index')->with('success', 'Testimonial updated successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to update: ' . $e->getMessage()])->withInput();
        }
    }

    public function destroy(int $id)
    {
        try {
            $this->homeService->deleteTestimonial($id);
            return redirect()->route('home-testimonials.index')->with('success', 'Testimonial deleted successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to delete']);
        }
    }
}
