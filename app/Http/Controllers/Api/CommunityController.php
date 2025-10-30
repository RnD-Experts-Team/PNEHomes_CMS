<?php

// app/Http/Controllers/Api/CommunityController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CommunityService;

class CommunityController extends Controller
{
    public function __construct(protected CommunityService $communityService) {}

    public function index()
    {
        try {
            $settings = $this->communityService->getSettings();
            $contact  = $this->communityService->getContact();
            $communities = $this->communityService->getAllCommunities();

            $list = $communities->map(function ($c) {
                return [
                    'id' => $c->id,
                    'slug' => $c->slug,
                    'title' => $c->title,
                    'city' => $c->city,
                    'address' => $c->address,
                    'latitude' => $c->latitude,
                    'longitude' => $c->longitude,
                    'card_image' => $c->card_image_url,
                    'gallery' => $c->gallery->pluck('url')->toArray(),
                    'video' => $c->video_url,
                    'community-features' => $c->community_features,
                    'floor-plans' => $c->floorplans
                        ->where('is_active', true)
                        ->sortBy('order')
                        ->map(fn($p) => [
                            'slug' => $p->slug,
                            'title' => $p->title,
                            'community' => $c->slug,
                            'cover' => $p->cover_url,
                            'status' => null,
                            'price' => $p->price,
                            'beds' => $p->beds,
                            'baths' => $p->baths,
                            'garages' => $p->garages,
                            'sqft' => $p->sqft,
                        ])->values()->toArray(),
                    'starting-price' => $c->starting_price,
                ];
            })->values()->toArray();

            return response()->json([
                'success' => true,
                'data' => [
                    'title' => $settings->title,
                    'cover' => $settings->cover_url,
                    'communities' => $list,
                    'zillow' => $settings->zillow_link,   // exact key used by frontend JSON
                    'contact' => $contact ? [
                        'title' => $contact->title,
                        'message' => $contact->message,
                    ] : null,
                ],
            ]);
        } catch (\Throwable $e) {
            return response()->json(['success'=>false,'message'=>'Failed to fetch communities'], 500);
        }
    }

    public function show(string $slug)
    {
        try {
            $c = $this->communityService->getCommunityBySlug($slug);
            $contact = $this->communityService->getContact();

            $data = [
                'id' => $c->id,
                'slug' => $c->slug,
                'title' => $c->title,
                'city' => $c->city,
                'address' => $c->address,
                'latitude' => $c->latitude,
                'longitude' => $c->longitude,
                'card_image' => $c->card_image_url,
                'gallery' => $c->gallery->pluck('url')->toArray(),
                'video' => $c->video_url,
                'community-features' => $c->community_features,
                'floor-plans' => $c->floorplans
                    ->where('is_active', true)
                    ->sortBy('order')
                    ->map(fn($p) => [
                        'slug' => $p->slug,
                        'title' => $p->title,
                        'community' => $c->slug,
                        'cover' => $p->cover_url,
                        'status' => $p->status,
                        'price' => $p->price,
                        'beds' => $p->beds,
                        'baths' => $p->baths,
                        'garages' => $p->garages,
                        'sqft' => $p->sqft,
                    ])->values()->toArray(),
                'starting-price' => $c->starting_price,
                'contact' => $contact ? [
                    'title' => $contact->title,
                    'message' => $contact->message,
                ] : null,
            ];

            return response()->json(['success'=>true,'data'=>$data]);
        } catch (\Throwable $e) {
            return response()->json(['success'=>false,'message'=>'Community not found'], 404);
        }
    }
}
