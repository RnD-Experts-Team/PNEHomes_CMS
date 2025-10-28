<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ContentPageService;

class ContentPageController extends Controller
{
    public function __construct(
        protected ContentPageService $contentPageService
    ) {}

    public function aboutUs()
    {
        try {
            $aboutUs = $this->contentPageService->getAboutUs();

            if (!$aboutUs) {
                return response()->json([
                    'success' => false,
                    'message' => 'About Us page not found',
                ], 404);
            }

            $data = [
                'cover' => $aboutUs->cover_url,
                'slogan' => $aboutUs->slogan,
                'title' => $aboutUs->title,
                'content' => $aboutUs->content,
            ];

            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch About Us page',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function privacyPolicy()
    {
        try {
            $privacyPolicy = $this->contentPageService->getPrivacyPolicy();

            $data = [
                'title' => $privacyPolicy->title,
                'slogan' => $privacyPolicy->slogan,
                'description' => $privacyPolicy->description,
                'cover' => $privacyPolicy->cover_url,
                'contact' => [
                    'title' => $privacyPolicy->contact_title,
                    'message' => $privacyPolicy->contact_message,
                ],
            ];

            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch Privacy Policy',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
