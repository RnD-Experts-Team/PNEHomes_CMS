<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\PropertyService;
use Illuminate\Http\Request;

class PropertyController extends Controller
{
    public function __construct(protected PropertyService $propertyService)
    {
    }

    public function index(Request $request)
    {
        try {
            $settings = $this->propertyService->getSettings();
            $filters = [
                'community' => $request->input('community'),
                'price' => $request->input('price'),
                'beds' => $request->input('beds'),
                'baths' => $request->input('baths'),
                'garages' => $request->input('garages'),
                'min' => $request->input('min'),
                'max' => $request->input('max'),
                'sortBy' => 'sqft',
                'sortOrder' => 'desc',
                'page' => (int) $request->input('page', 1),
                'limit' => (int) $request->input('limit', 9),
            ];

            $filterKeys = ['community', 'price', 'beds', 'baths', 'garages', 'min', 'max'];

            $hasFilters = collect($filters)
                ->only($filterKeys)
                ->filter(fn($v) => !is_null($v) && $v !== '')
                ->isNotEmpty();

            if ($hasFilters) {
                $filters['sortBy'] = $request->input('sortBy', 'sqft');
                $filters['sortOrder'] = $request->input('sortOrder', 'desc');
            } else {
                $filters['sortBy'] = 'order';
                $filters['sortOrder'] = 'asc';
            }
            $properties = $this->propertyService->getAllProperties($filters);
            $total = $this->propertyService->getTotalCount($filters);
            $communities = $this->propertyService->getUniqueCommunities();

            $data = [
                'title' => $settings->title,

                // ✅ settings media
                'cover' => $settings->cover_url,
                'cover_type' => $settings->cover_image_type,

                'properties' => $properties->map(fn($p) => [
                    'id' => $p->id,
                    'slug' => $p->slug,
                    'title' => $p->title,
                    'community' => $p->community,
                    'price' => $p->price,
                    'beds' => $p->beds,
                    'baths' => $p->baths,
                    'garages' => $p->garages,
                    'sqft' => $p->sqft,

                    // ✅ gallery fixed
                    'gallery' => $p->gallery->map(fn($g) => [
                        'url' => $g->url,
                        'type' => $g->image_type,
                    ])->toArray(),

                    'zillow_link' => $p->zillow_link,

                    'Whats_special' => $p->whatsSpecial ? [
                        'badges' => $p->whatsSpecial->badges,
                        'description' => $p->whatsSpecial->description,
                    ] : null,

                    'Facts_features' => $p->factsFeatures->map(fn($f) => [
                        'title' => $f->title,
                        'list' => $f->list,
                    ])->toArray(),

                    // ✅ floor plans fixed
                    'Floor_plans' => $p->floorPlans->map(fn($fp) => [
                        'title' => $fp->title,
                        'image' => $fp->img,
                        'image_type' => $fp->image_type,
                        'description' => $fp->description,
                    ])->toArray(),
                ])->toArray(),

                'pagination' => [
                    'current_page' => (int) $filters['page'],
                    'per_page' => (int) $filters['limit'],
                    'total' => $total,
                    'last_page' => ceil($total / $filters['limit']),
                ],

                'filters' => [
                    'communities' => $communities,
                ],
            ];
            return response()->json(['success' => true, 'data' => $data]);

        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => 'Failed to fetch properties'], 500);
        }
    }

    public function show(string $slug)
    {
        try {
            $settings = $this->propertyService->getSettings();
            $property = $this->propertyService->getPropertyBySlug($slug);

            $data = [
                'id' => $property->id,
                'slug' => $property->slug,
                'title' => $property->title,
                'community' => $property->community,
                'price' => $property->price,
                'beds' => $property->beds,
                'baths' => $property->baths,
                'garages' => $property->garages,
                'sqft' => $property->sqft,

                // ✅ gallery fixed
                'gallery' => $property->gallery->map(fn($g) => [
                    'url' => $g->url,
                    'type' => $g->image_type,
                ])->toArray(),

                'zillow_link' => $property->zillow_link,

                'Whats_special' => $property->whatsSpecial ? [
                    'badges' => $property->whatsSpecial->badges,
                    'description' => $property->whatsSpecial->description,
                ] : null,

                'Facts_features' => $property->factsFeatures->map(fn($f) => [
                    'title' => $f->title,
                    'list' => $f->list,
                ])->toArray(),

                // ✅ floor plans fixed
                'Floor_plans' => $property->floorPlans->map(fn($fp) => [
                    'title' => $fp->title,
                    'image' => $fp->img,
                    'image_type' => $fp->image_type,
                    'description' => $fp->description,
                ])->toArray(),

                'contact' => [
                    'title' => $settings->contact_title,
                    'message' => str_replace('{propertyTitle}', $property->title, $settings->contact_message),
                ],
            ];

            return response()->json(['success' => true, 'data' => $data]);

        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => 'Property not found'], 404);
        }
    }

    public function getContact()
    {
        try {
            $settings = $this->propertyService->getSettings();

            $data = [
                'title' => $settings->contact_title,
                'message' => $settings->contact_message,
            ];

            return response()->json(['success' => true, 'data' => $data]);

        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => 'Failed to fetch contact'], 500);
        }
    }
}