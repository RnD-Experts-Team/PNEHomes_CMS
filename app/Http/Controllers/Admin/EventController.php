<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\EventService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventController extends Controller
{
    public function __construct(
        protected EventService $eventService
    ) {}

    public function index()
    {
        $events = $this->eventService->getAllEventsForAdmin();

        return Inertia::render('Events/Index', [
            'events' => $events,
        ]);
    }

    public function create()
    {
        return Inertia::render('Events/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'cover_image_id' => 'nullable|string',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
            'gallery' => 'nullable|array',
            'gallery.*' => 'required|string',
        ]);

        try {
            $this->eventService->createEvent($validated);

            return redirect()
                ->route('events.index')
                ->with('success', 'Event created successfully');
        } catch (\Exception $e) {
            return back()
                ->withErrors(['error' => 'Failed to create event: ' . $e->getMessage()])
                ->withInput();
        }
    }

    public function edit(int $id)
    {
        $event = $this->eventService->getEventForAdmin($id);

        return Inertia::render('Events/Edit', [
            'event' => $event,
        ]);
    }

    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'cover_image_id' => 'nullable|string',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
            'gallery' => 'nullable|array',
            'gallery.*' => 'required|string',
        ]);

        try {
            $this->eventService->updateEvent($id, $validated);

            return redirect()
                ->route('events.index')
                ->with('success', 'Event updated successfully');
        } catch (\Exception $e) {
            return back()
                ->withErrors(['error' => 'Failed to update event: ' . $e->getMessage()])
                ->withInput();
        }
    }

    public function destroy(int $id)
    {
        try {
            $this->eventService->deleteEvent($id);

            return redirect()
                ->route('events.index')
                ->with('success', 'Event deleted successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to delete event']);
        }
    }
}
