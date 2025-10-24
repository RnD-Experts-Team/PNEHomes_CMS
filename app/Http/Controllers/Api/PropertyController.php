<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\PropertyService;

class PropertyController extends Controller
{
    public function __construct(
        protected PropertyService $propertyService
    ) {}

    public function index()
    {
        try {
            $properties = $this->propertyService->getAllProperties();

            $data = $properties->map(function ($property) {
                return [
                    'id' => $property->id,
                    'slug' => $property->slug,
                    'title' => $property->title,
                    'community' => $property->community,
                    'price' => $property->price,
                    'beds' => $property->beds,
                    'baths' => $property->baths,
                    'garages' => $property->garages,
                    'sqft' => $property->sqft,
                    'cover' => $property->cover_url,
                ];
            })->toArray();

            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch properties',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show(string $slug)
    {
        try {
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
                'zillow_link' => $property->zillow_link,
                'next_property_slug' => $property->next_property_slug,
                'prev_property_slug' => $property->prev_property_slug,
                'gallery' => $property->gallery->pluck('url')->toArray(),
                'whats_special' => $property->whatsSpecial ? [
                    'badges' => $property->whatsSpecial->badges,
                    'description' => $property->whatsSpecial->description,
                ] : null,
                'facts_features' => $property->factsFeatures->map(function ($fact) {
                    return [
                        'title' => $fact->title,
                        'list' => $fact->list,
                    ];
                })->toArray(),
                'floor_plans' => $property->floorPlans->map(function ($plan) {
                    return [
                        'title' => $plan->title,
                        'img' => $plan->img,
                        'description' => $plan->description,
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
                'message' => 'Property not found',
            ], 404);
        }
    }

    public function getContact()
    {
        try {
            $contact = $this->propertyService->getContact();

            if (!$contact) {
                return response()->json([
                    'success' => false,
                    'message' => 'Contact information not found',
                ], 404);
            }

            $data = [
                'title' => $contact->title,
                'message' => $contact->message,
            ];

            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch contact information',
            ], 500);
        }
    }
}
