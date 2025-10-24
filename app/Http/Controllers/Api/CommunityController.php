<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CommunityService;

class CommunityController extends Controller
{
    public function __construct(
        protected CommunityService $communityService
    ) {}

    public function index()
    {
        try {
            $communities = $this->communityService->getAllCommunities();

            $data = $communities->map(function ($community) {
                return [
                    'id' => $community->id,
                    'slug' => $community->slug,
                    'title' => $community->title,
                    'city' => $community->city,
                    'card_image' => $community->card_image_url,
                    'starting_price' => $community->starting_price,
                ];
            })->toArray();

            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch communities',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show(string $slug)
    {
        try {
            $community = $this->communityService->getCommunityBySlug($slug);
            $contact = $this->communityService->getContact();

            $data = [
                'id' => $community->id,
                'slug' => $community->slug,
                'title' => $community->title,
                'city' => $community->city,
                'address' => $community->address,
                'video' => $community->video_url,
                'gallery' => $community->gallery->pluck('url')->toArray(),
                'community_features' => $community->community_features,
                'starting_price' => $community->starting_price,
                'contact' => $contact ? [
                    'title' => $contact->title,
                    'message' => $contact->message,
                ] : null,
            ];

            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Community not found',
            ], 404);
        }
    }
}
