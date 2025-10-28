<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\HomeService;

class HomeController extends Controller
{
    public function __construct(
        protected HomeService $homeService
    ) {}

    public function index()
    {
        try {
            $homeData = $this->homeService->getHomeData();

            $data = [
                'first_section' => $homeData['first_section'] ? [
                    'mobile_cover' => $homeData['first_section']->mobile_cover_url,
                    'logo' => $homeData['first_section']->logo_url,
                    'title' => $homeData['first_section']->title,
                    'subtitle' => $homeData['first_section']->subtitle,
                    'book_button_text' => $homeData['first_section']->book_button_text,
                ] : null,
                'hero_sections' => $homeData['hero_sections']->map(function ($section) {
                    return [
                        'icon' => $section->icon,
                        'title' => $section->title,
                        'description' => $section->description,
                    ];
                })->toArray(),
                'hero' => $homeData['hero'] ? [
                    'title' => $homeData['hero']->title,
                    'subtitle' => $homeData['hero']->subtitle,
                ] : null,
                'services' => $homeData['services'] ? [
                    'title' => $homeData['services']->title,
                    'cover' => $homeData['services']->cover_url,
                    'description' => $homeData['services']->description,
                    'links' => $homeData['service_links']->map(function ($link) {
                        return [
                            'title' => $link->title,
                            'slug' => $link->slug,
                        ];
                    })->toArray(),
                ] : null,
                'grid_section' => $homeData['grid_section'] ? [
                    'video' => $homeData['grid_section']->video_url,
                    'logo' => $homeData['grid_section']->logo_url,
                    'links' => $homeData['grid_links']->map(function ($link) {
                        return [
                            'title' => $link->title,
                            'cover' => $link->cover_url,
                        ];
                    })->toArray(),
                ] : null,
                'testimonials' => $homeData['testimonials']->map(function ($testimonial) {
                    return [
                        'description' => $testimonial->description,
                        'by' => $testimonial->by,
                    ];
                })->toArray(),
                'contact' => [
                    'title' => $homeData['settings']?->contact_title ?? 'CONTACT',
                ],
            ];

            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch home data',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
