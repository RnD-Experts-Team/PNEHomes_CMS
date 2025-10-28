<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\EventService;

class EventController extends Controller
{
    public function __construct(
        protected EventService $eventService
    ) {}

    public function index()
    {
        try {
            $events = $this->eventService->getAllEvents();
            $settings = $this->eventService->getSettings();

            $data = [
                'cover' => $settings?->cover_url,
                'slogan' => $settings?->slogan,
                'title' => $settings?->title,
                'events' => $events->map(function ($event) {
                    return [
                        'id' => $event->id,
                        'title' => $event->title,
                        'description' => $event->description,
                        'cover' => $event->cover_url,
                        'gallery' => $event->gallery->pluck('url')->toArray(),
                    ];
                })->toArray(),
                'contact' => $settings ? [
                    'title' => $settings->contact_title,
                    'message' => $settings->contact_message,
                ] : null,
            ];

            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch events',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
