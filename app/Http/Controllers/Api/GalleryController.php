<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\GalleryService;

class GalleryController extends Controller
{
    public function __construct(protected GalleryService $galleryService)
    {
    }

    public function index()
    {
        try {
            $settings = $this->galleryService->getSettings();
            $albums = $this->galleryService->getAllAlbums();

            $data = [
                'title' => $settings->title,
                'cover' => $settings->cover_url,
                'cover_type' => $settings->cover_type,

                'gallery' => $albums->map(function ($album) {
                    return [
                        'id' => $album->id,
                        'slug' => $album->slug,
                        'title' => $album->title,

                        'cover_img' => $album->cover_url,
                        'cover_img_type' => $album->cover_type,

                        'sub_albums' => $album->has_sub_albums
                            ? $album->subAlbums->map(fn($sub) => [
                                'slug' => $sub->slug,
                                'title' => $sub->title,

                                'cover_img' => $sub->cover_url,
                                'cover_img_type' => $sub->cover_type,

                                'gallery' => $sub->images->map(fn($img) => [
                                    'virtual_img' => $img->virtual_url,
                                    'virtual_img_type' => $img->virtual_type,

                                    'real_img' => $img->real_url,
                                    'real_img_type' => $img->real_type,
                                ])->toArray(),
                            ])->toArray()
                            : [],

                        'gallery' => !$album->has_sub_albums
                            ? $album->images->map(fn($img) => [
                                'virtual_img' => $img->virtual_url,
                                'virtual_img_type' => $img->virtual_type,

                                'real_img' => $img->real_url,
                                'real_img_type' => $img->real_type,
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
            return response()->json(['success' => false, 'message' => 'Failed to fetch gallery'], 500);
        }
    }

    public function show(string $slug)
    {
        try {
            $settings = $this->galleryService->getSettings();
            $album = $this->galleryService->getAlbumBySlug($slug);

            $data = [
                'id' => $album->id,
                'slug' => $album->slug,
                'title' => $album->title,

                'cover_img' => $album->cover_url,
                'cover_img_type' => $album->cover_type,

                'sub_albums' => $album->has_sub_albums
                    ? $album->subAlbums->map(fn($sub) => [
                        'slug' => $sub->slug,
                        'title' => $sub->title,

                        'cover_img' => $sub->cover_url,
                        'cover_img_type' => $sub->cover_type,

                        'gallery' => $sub->images->map(fn($img) => [
                            'virtual_img' => $img->virtual_url,
                            'virtual_img_type' => $img->virtual_type,

                            'real_img' => $img->real_url,
                            'real_img_type' => $img->real_type,
                        ])->toArray(),
                    ])->toArray()
                    : [],

                'gallery' => !$album->has_sub_albums
                    ? $album->images->map(fn($img) => [
                        'virtual_img' => $img->virtual_url,
                        'virtual_img_type' => $img->virtual_type,

                        'real_img' => $img->real_url,
                        'real_img_type' => $img->real_type,
                    ])->toArray()
                    : [],

                'contact' => [
                    'title' => $settings->contact_title,
                    'message' => $settings->contact_message,
                ],
            ];

            return response()->json(['success' => true, 'data' => $data]);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => 'Album not found'], 404);
        }
    }

    public function showSubAlbum(string $albumSlug, string $subAlbumSlug)
    {
        try {
            $settings = $this->galleryService->getSettings();
            $album = $this->galleryService->getAlbumBySlug($albumSlug);
            $subAlbum = $this->galleryService->getSubAlbumBySlug($album->id, $subAlbumSlug);

            $data = [
                'album' => [
                    'slug' => $album->slug,
                    'title' => $album->title,
                ],

                'sub_album' => [
                    'slug' => $subAlbum->slug,
                    'title' => $subAlbum->title,

                    'cover_img' => $subAlbum->cover_url,
                    'cover_img_type' => $subAlbum->cover_type,

                    'gallery' => $subAlbum->images->map(fn($img) => [
                        'virtual_img' => $img->virtual_url,
                        'virtual_img_type' => $img->virtual_type,

                        'real_img' => $img->real_url,
                        'real_img_type' => $img->real_type,
                    ])->toArray(),
                ],

                'contact' => [
                    'title' => $settings->contact_title,
                    'message' => $settings->contact_message,
                ],
            ];

            return response()->json(['success' => true, 'data' => $data]);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => 'Sub-album not found'], 404);
        }
    }
}