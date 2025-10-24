<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
use App\Http\Controllers\Api\ServiceController;

// Services API Routes
Route::prefix('services')->group(function () {
    Route::get('/', [ServiceController::class, 'index']);
    Route::get('/{slug}', [ServiceController::class, 'show']);
});
use App\Http\Controllers\Api\PropertyController;

// Properties API Routes
Route::prefix('properties')->group(function () {
    Route::get('/', [PropertyController::class, 'index']);
    Route::get('/contact', [PropertyController::class, 'getContact']);
    Route::get('/{slug}', [PropertyController::class, 'show']);
});
use App\Http\Controllers\Api\CommunityController;

// Communities API Routes
Route::prefix('communities')->group(function () {
    Route::get('/', [CommunityController::class, 'index']);
    Route::get('/{slug}', [CommunityController::class, 'show']);
});
use App\Http\Controllers\Api\GalleryController;

// Gallery API Routes
Route::prefix('gallery')->group(function () {
    Route::get('/', [GalleryController::class, 'index']);
    Route::get('/{slug}', [GalleryController::class, 'show']);
    Route::get('/{albumSlug}/{subAlbumSlug}', [GalleryController::class, 'showSubAlbum']);
});
use App\Http\Controllers\Api\EventController;

// Events API Routes
Route::get('/events', [EventController::class, 'index']);
use App\Http\Controllers\Api\TeamController;

// Team API Routes
Route::get('/team', [TeamController::class, 'index']);
use App\Http\Controllers\Api\BuildingOptionsController;

// Building Options API Routes
Route::prefix('building-options')->group(function () {
    Route::get('/', [BuildingOptionsController::class, 'index']);
    Route::get('/articles/{slug}', [BuildingOptionsController::class, 'showArticle']);
});
use App\Http\Controllers\Api\HomeController;

// Home API Routes
Route::get('/home', [HomeController::class, 'index']);
use App\Http\Controllers\Api\LayoutController;

// Layout API Routes
Route::get('/layout', [LayoutController::class, 'index']);
use App\Http\Controllers\Api\ContentPageController;

// Content Pages API Routes
Route::get('/about-us', [ContentPageController::class, 'aboutUs']);
Route::get('/privacy-policy', [ContentPageController::class, 'privacyPolicy']);
use App\Http\Controllers\Api\FloorPlanController;

// Floor Plans API Routes
Route::get('/floor-plans', [FloorPlanController::class, 'index']);
