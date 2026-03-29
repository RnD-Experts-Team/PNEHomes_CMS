<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ServiceService;

class ServiceController extends Controller
{
    public function __construct(
        protected ServiceService $serviceService
    ) {
    }

    public function index()
    {
        try {
            $services = $this->serviceService->getAllServices();
            $settings = $this->serviceService->getSettings();

            $data = [
                // ✅ fixed settings media
                'cover' => $settings?->image_url,
                'cover_type' => $settings?->image_type,

                'services' => $services->map(function ($service) {
                    return [
                        'id' => $service->id,
                        'slug' => $service->slug,
                        'title' => $service->title,
                        'sub_title' => $service->sub_title,
                        'description' => $service->description,

                        // ✅ fixed content items
                        'content' => $service->contentItems->map(function ($item) {
                            return [
                                'image' => $item->image_url,
                                'image_type' => $item->image_type,

                                'sub_title' => $item->sub_title,
                                'description' => $item->description,
                            ];
                        })->toArray(),

                        'contact' => $service->contact ? [
                            'title' => $service->contact->title,
                            'message' => $service->contact->message,
                        ] : null,
                    ];
                })->toArray(),
            ];

            return response()->json([
                'success' => true,
                'data' => $data,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch services',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show(string $slug)
    {
        try {
            $service = $this->serviceService->getServiceBySlug($slug);

            $data = [
                'id' => $service->id,
                'slug' => $service->slug,
                'title' => $service->title,
                'sub_title' => $service->sub_title,
                'description' => $service->description,

                // ✅ fixed content items
                'content' => $service->contentItems->map(function ($item) {
                    return [
                        'image' => $item->image_url,
                        'image_type' => $item->image_type,

                        'sub_title' => $item->sub_title,
                        'description' => $item->description,
                    ];
                })->toArray(),

                'contact' => $service->contact ? [
                    'title' => $service->contact->title,
                    'message' => $service->contact->message,
                ] : null,
            ];

            return response()->json([
                'success' => true,
                'data' => $data,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Service not found',
            ], 404);
        }
    }
}