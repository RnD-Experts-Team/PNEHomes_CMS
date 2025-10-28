<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ServiceService;

class ServiceController extends Controller
{
    public function __construct(
        protected ServiceService $serviceService
    ) {}

    public function index()
    {
        try {
            $services = $this->serviceService->getAllServices();
            $cover = $this->serviceService->getSettings()->img;

            $data = [
                'cover' => $cover,
                'services' => $services->map(function ($service) {
                    return [
                        'id' => $service->id,
                        'slug' => $service->slug,
                        'title' => $service->title,
                        'sub_title' => $service->sub_title,
                        'description' => $service->description,
                        'content' => $service->contentItems->map(function ($item) {
                            return [
                                'img' => $item->img,
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
                'content' => $service->contentItems->map(function ($item) {
                    return [
                        'img' => $item->img,
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
