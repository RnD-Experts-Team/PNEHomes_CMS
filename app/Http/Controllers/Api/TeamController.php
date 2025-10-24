<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\TeamService;

class TeamController extends Controller
{
    public function __construct(
        protected TeamService $teamService
    ) {}

    public function index()
    {
        try {
            $members = $this->teamService->getAllMembers();
            $settings = $this->teamService->getSettings();

            $data = [
                'cover' => $settings?->cover_url,
                'slogan' => $settings?->slogan,
                'title' => $settings?->title,
                'subtitle' => $settings?->subtitle,
                'description' => $settings?->description,
                'team' => $members->map(function ($member) {
                    return [
                        'id' => $member->id,
                        'cover' => $member->cover_url,
                        'name' => $member->name,
                        'position' => $member->position,
                        'description' => $member->description,
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
                'message' => 'Failed to fetch team',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
