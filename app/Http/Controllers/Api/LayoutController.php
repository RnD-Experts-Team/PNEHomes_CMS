<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\LayoutService;

class LayoutController extends Controller
{
    public function __construct(
        protected LayoutService $layoutService
    ) {}

    public function index()
    {
        try {
            $layoutData = $this->layoutService->getLayoutData();

            $data = [
                'navigation' => [
                    'logo' => $layoutData['navigation']?->logo_url,
                    'links' => $layoutData['navigation_links']->map(function ($link) {
                        return [
                            'title' => $link->title,
                            'slug' => $link->slug,
                        ];
                    })->toArray(),
                    'contact' => $layoutData['contact_info_navigation'],
                ],
                'footer' => [
                    'links' => $layoutData['footer_links']->map(function ($link) {
                        return [
                            'title' => $link->title,
                            'slug' => $link->slug,
                        ];
                    })->toArray(),
                ],
                'contact' => $layoutData['contact_info'] ? [
                    'phone' => $layoutData['contact_info']->phone,
                    'email' => $layoutData['contact_info']->email,
                    'address' => $layoutData['contact_info']->address,
                ] : null,
                'social' => $layoutData['social_links']->map(function ($link) {
                    return [
                        'platform' => $link->platform,
                        'url' => $link->url,
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
                'message' => 'Failed to fetch layout data',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
