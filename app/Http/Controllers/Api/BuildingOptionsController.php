<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\BuildingOptionsService;

class BuildingOptionsController extends Controller
{
    public function __construct(
        protected BuildingOptionsService $buildingOptionsService
    ) {}

    public function index()
    {
        try {
            $options = $this->buildingOptionsService->getAllOptions();
            $articles = $this->buildingOptionsService->getAllArticles();
            $settings = $this->buildingOptionsService->getSettings();

            $data = [
                'cover' => $settings?->cover_url,
                'slogan' => $settings?->slogan,
                'title' => $settings?->title,
                'sections' => $options->map(function ($option) {
                    return [
                        'id' => $option->id,
                        'title' => $option->title,
                        'description' => $option->description,
                        'section_image' => $option->section_image_url,
                    ];
                })->toArray(),
                'articles_cover' => $settings?->articles_cover_url,
                'articles' => $articles->map(function ($article) {
                    return [
                        'id' => $article->id,
                        'slug' => $article->slug,
                        'title' => $article->title,
                        'description' => $article->description,
                        'content' => $article->content,
                        'image' => $article->image_url,
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
                'message' => 'Failed to fetch building options',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function showArticle(string $slug)
    {
        try {
            $article = $this->buildingOptionsService->getArticleBySlug($slug);

            $data = [
                'id' => $article->id,
                'slug' => $article->slug,
                'title' => $article->title,
                'description' => $article->description,
                'image' => $article->image_url,
                'content' => $article->content,
            ];

            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Article not found',
            ], 404);
        }
    }
}
