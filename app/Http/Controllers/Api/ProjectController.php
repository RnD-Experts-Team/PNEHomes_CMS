<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ProjectService;

class ProjectController extends Controller
{
    public function __construct(protected ProjectService $projectService)
    {
    }

    public function index()
    {
        try {
            $settings = $this->projectService->getSettings();
            $lots = $this->projectService->getAllLots();

            $data = [
                'title' => $settings->title,
                'cover' => $settings->cover_url,
                'cover_type' => $settings->cover_image_type,

                'gallery' => $lots->map(function ($lot) {
                    return [
                        'id' => $lot->id,
                        'slug' => $lot->slug,
                        'title' => $lot->title,

                        'cover_img' => $lot->cover_url,
                        'cover_img_type' => $lot->cover_image_type,

                        'sub_albums' => $lot->has_rooms
                            ? $lot->rooms->map(fn($room) => [
                                'slug' => $room->slug,
                                'title' => $room->title,

                                'cover_img' => $room->cover_url,
                                'cover_img_type' => $room->cover_image_type,

                                'gallery' => $room->images->map(fn($img) => [
                                    'virtual_img' => $img->virtual_url,
                                    'virtual_img_type' => $img->virtual_image_type,

                                    'real_img' => $img->real_url,
                                    'real_img_type' => $img->real_image_type,
                                ])->toArray(),
                            ])->toArray()
                            : [],

                        'gallery' => !$lot->has_rooms
                            ? $lot->images->map(fn($img) => [
                                'virtual_img' => $img->virtual_url,
                                'virtual_img_type' => $img->virtual_image_type,

                                'real_img' => $img->real_url,
                                'real_img_type' => $img->real_image_type,
                            ])->toArray()
                            : [],
                    ];
                })->toArray(),

                'contact' => [
                    'title' => $settings->contact_title,
                    'message' => $settings->contact_message,
                ],
            ];

            return response()->json(['success' => true, 'data' => $data]);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => 'Failed to fetch projects'], 500);
        }
    }

    public function show(string $slug)
    {
        try {
            $settings = $this->projectService->getSettings();
            $lot = $this->projectService->getLotBySlug($slug);

            $data = [
                'id' => $lot->id,
                'slug' => $lot->slug,
                'title' => $lot->title,

                'cover_img' => $lot->cover_url,
                'cover_img_type' => $lot->cover_image_type,

                'sub_albums' => $lot->has_rooms
                    ? $lot->rooms->map(fn($room) => [
                        'slug' => $room->slug,
                        'title' => $room->title,

                        'cover_img' => $room->cover_url,
                        'cover_img_type' => $room->cover_image_type,

                        'gallery' => $room->images->map(fn($img) => [
                            'virtual_img' => $img->virtual_url,
                            'virtual_img_type' => $img->virtual_image_type,

                            'real_img' => $img->real_url,
                            'real_img_type' => $img->real_image_type,
                        ])->toArray(),
                    ])->toArray()
                    : [],

                'gallery' => !$lot->has_rooms
                    ? $lot->images->map(fn($img) => [
                        'virtual_img' => $img->virtual_url,
                        'virtual_img_type' => $img->virtual_image_type,

                        'real_img' => $img->real_url,
                        'real_img_type' => $img->real_image_type,
                    ])->toArray()
                    : [],

                'contact' => [
                    'title' => $settings->contact_title,
                    'message' => $settings->contact_message,
                ],
            ];

            return response()->json(['success' => true, 'data' => $data]);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => 'Lot not found'], 404);
        }
    }

    public function showRoom(string $lotSlug, string $roomSlug)
    {
        try {
            $settings = $this->projectService->getSettings();
            $lot = $this->projectService->getLotBySlug($lotSlug);
            $room = $this->projectService->getRoomBySlug($lot->id, $roomSlug);

            $data = [
                'lot' => [
                    'slug' => $lot->slug,
                    'title' => $lot->title,
                ],

                'sub_album' => [
                    'slug' => $room->slug,
                    'title' => $room->title,

                    'cover_img' => $room->cover_url,
                    'cover_img_type' => $room->cover_image_type,

                    'gallery' => $room->images->map(fn($img) => [
                        'virtual_img' => $img->virtual_url,
                        'virtual_img_type' => $img->virtual_image_type,

                        'real_img' => $img->real_url,
                        'real_img_type' => $img->real_image_type,
                    ])->toArray(),
                ],

                'contact' => [
                    'title' => $settings->contact_title,
                    'message' => $settings->contact_message,
                ],
            ];

            return response()->json(['success' => true, 'data' => $data]);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => 'Room not found'], 404);
        }
    }
}
