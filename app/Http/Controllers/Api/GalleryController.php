<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\GalleryService;

class GalleryController extends Controller
{
    public function __construct(
        protected GalleryService $galleryService
    ) {}

    public function index()
    {
        try {
            $albums = $this->galleryService->getAllAlbums();
            $contact = $this->galleryService->getContact();

            $data = [
                'albums' => $albums->map(function ($album) {
                    $albumData = [
                        'id' => $album->id,
                        'slug' => $album->slug,
                        'title' => $album->title,
                        'cover' => [
                            'virtual' => $album->cover_virtual_url,
                            'real' => $album->cover_real_url,
                        ],
                        'has_sub_albums' => $album->has_sub_albums,
                    ];

                    if ($album->has_sub_albums) {
                        $albumData['sub_albums'] = $album->subAlbums->map(function ($subAlbum) {
                            return [
                                'slug' => $subAlbum->slug,
                                'title' => $subAlbum->title,
                                'cover' => [
                                    'virtual' => $subAlbum->cover_virtual_url,
                                    'real' => $subAlbum->cover_real_url,
                                ],
                            ];
                        })->toArray();
                    } else {
                        $albumData['images'] = $album->images->map(function ($image) {
                            return [
                                'virtual' => $image->virtual_url,
                                'real' => $image->real_url,
                            ];
                        })->toArray();
                    }

                    return $albumData;
                })->toArray(),
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
                'message' => 'Failed to fetch gallery',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show(string $slug)
    {
        try {
            $album = $this->galleryService->getAlbumBySlug($slug);

            $data = [
                'id' => $album->id,
                'slug' => $album->slug,
                'title' => $album->title,
                'has_sub_albums' => $album->has_sub_albums,
            ];

            if ($album->has_sub_albums) {
                $data['sub_albums'] = $album->subAlbums->map(function ($subAlbum) {
                    return [
                        'slug' => $subAlbum->slug,
                        'title' => $subAlbum->title,
                        'cover' => [
                            'virtual' => $subAlbum->cover_virtual_url,
                            'real' => $subAlbum->cover_real_url,
                        ],
                        'images' => $subAlbum->images->map(function ($image) {
                            return [
                                'virtual' => $image->virtual_url,
                                'real' => $image->real_url,
                            ];
                        })->toArray(),
                    ];
                })->toArray();
            } else {
                $data['images'] = $album->images->map(function ($image) {
                    return [
                        'virtual' => $image->virtual_url,
                        'real' => $image->real_url,
                    ];
                })->toArray();
            }

            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Album not found',
            ], 404);
        }
    }

    public function showSubAlbum(string $albumSlug, string $subAlbumSlug)
    {
        try {
            $subAlbum = $this->galleryService->getSubAlbumBySlug($albumSlug, $subAlbumSlug);

            $data = [
                'slug' => $subAlbum->slug,
                'title' => $subAlbum->title,
                'images' => $subAlbum->images->map(function ($image) {
                    return [
                        'virtual' => $image->virtual_url,
                        'real' => $image->real_url,
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
                'message' => 'Sub-album not found',
            ], 404);
        }
    }
}
