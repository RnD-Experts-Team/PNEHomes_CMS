<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\ServiceController;
use Illuminate\Support\Facades\Auth;

Route::get('/', function () {
    if (Auth::check()) {
        return redirect('/admin/home');
    }

    return redirect('/login');
})->name('home');

// Admin Service Routes (Protected by auth middleware)
Route::middleware(['auth'])->prefix('admin')->name('services.')->group(function () {
    Route::get('/services', [ServiceController::class, 'index'])->name('index');
    Route::get('/services/create', [ServiceController::class, 'create'])->name('create');
    Route::post('/services', [ServiceController::class, 'store'])->name('store');
    Route::get('/services/{id}/edit', [ServiceController::class, 'edit'])->name('edit');
    Route::put('/services/{id}', [ServiceController::class, 'update'])->name('update');
    Route::delete('/services/{id}', [ServiceController::class, 'destroy'])->name('destroy');
});

use App\Http\Controllers\Admin\PropertyController;

// Admin Property Routes (Protected by auth middleware)
Route::middleware(['auth'])->prefix('admin')->name('properties.')->group(function () {
    Route::get('/properties', [PropertyController::class, 'index'])->name('index');
    Route::get('/properties/create', [PropertyController::class, 'create'])->name('create');
    Route::post('/properties', [PropertyController::class, 'store'])->name('store');
    Route::get('/properties/{id}/edit', [PropertyController::class, 'edit'])->name('edit');
    Route::put('/properties/{id}', [PropertyController::class, 'update'])->name('update');
    Route::delete('/properties/{id}', [PropertyController::class, 'destroy'])->name('destroy');
});

use App\Http\Controllers\Admin\CommunityController;
use App\Http\Controllers\Admin\CommunitiesFloorplansController;
use App\Http\Controllers\Admin\CommunitiesSettingsController;

// Admin Community Routes (Protected by auth middleware)
Route::middleware(['auth'])->prefix('admin')->group(function () {
    // Communities CRUD
    Route::name('communities.')->group(function () {
        Route::get('/communities', [CommunityController::class, 'index'])->name('index');
        Route::get('/communities/create', [CommunityController::class, 'create'])->name('create');
        Route::post('/communities', [CommunityController::class, 'store'])->name('store');
        Route::get('/communities/{id}/edit', [CommunityController::class, 'edit'])->name('edit');
        Route::put('/communities/{id}', [CommunityController::class, 'update'])->name('update');
        Route::delete('/communities/{id}', [CommunityController::class, 'destroy'])->name('destroy');
    });

    // Communities Floor Plans CRUD
    Route::name('communities-floorplans.')->group(function () {
        Route::get('/communities-floorplans', [CommunitiesFloorplansController::class, 'index'])->name('index');
        Route::get('/communities-floorplans/create', [CommunitiesFloorplansController::class, 'create'])->name('create');
        Route::post('/communities-floorplans', [CommunitiesFloorplansController::class, 'store'])->name('store');
        Route::get('/communities-floorplans/{id}/edit', [CommunitiesFloorplansController::class, 'edit'])->name('edit');
        Route::put('/communities-floorplans/{id}', [CommunitiesFloorplansController::class, 'update'])->name('update');
        Route::delete('/communities-floorplans/{id}', [CommunitiesFloorplansController::class, 'destroy'])->name('destroy');
    });

    // Communities Settings
    Route::name('communities-settings.')->group(function () {
        Route::get('/communities-settings', [CommunitiesSettingsController::class, 'edit'])->name('edit');
        Route::put('/communities-settings', [CommunitiesSettingsController::class, 'update'])->name('update');
    });
});

use App\Http\Controllers\Admin\GalleryAlbumController;

// Admin Gallery Routes (Protected by auth middleware)
Route::middleware(['auth'])->prefix('admin')->name('gallery-albums.')->group(function () {
    Route::get('/gallery-albums', [GalleryAlbumController::class, 'index'])->name('index');
    Route::get('/gallery-albums/create', [GalleryAlbumController::class, 'create'])->name('create');
    Route::post('/gallery-albums', [GalleryAlbumController::class, 'store'])->name('store');
    Route::get('/gallery-albums/{id}/edit', [GalleryAlbumController::class, 'edit'])->name('edit');
    Route::put('/gallery-albums/{id}', [GalleryAlbumController::class, 'update'])->name('update');
    Route::delete('/gallery-albums/{id}', [GalleryAlbumController::class, 'destroy'])->name('destroy');
});

use App\Http\Controllers\Admin\EventController;
use App\Http\Controllers\Admin\EventSettingsController;

// Admin Event Routes (Protected by auth middleware)
Route::middleware(['auth'])->prefix('admin')->group(function () {
    Route::name('events.')->group(function () {
        Route::get('/events', [EventController::class, 'index'])->name('index');
        Route::get('/events/create', [EventController::class, 'create'])->name('create');
        Route::post('/events', [EventController::class, 'store'])->name('store');
        Route::get('/events/{id}/edit', [EventController::class, 'edit'])->name('edit');
        Route::put('/events/{id}', [EventController::class, 'update'])->name('update');
        Route::delete('/events/{id}', [EventController::class, 'destroy'])->name('destroy');
    });

    Route::name('event-settings.')->group(function () {
        Route::get('/event-settings', [EventSettingsController::class, 'edit'])->name('edit');
        Route::put('/event-settings', [EventSettingsController::class, 'update'])->name('update');
    });
});

use App\Http\Controllers\Admin\TeamMemberController;
use App\Http\Controllers\Admin\TeamSettingsController;

// Admin Team Routes (Protected by auth middleware)
Route::middleware(['auth'])->prefix('admin')->group(function () {
    Route::name('team-members.')->group(function () {
        Route::get('/team-members', [TeamMemberController::class, 'index'])->name('index');
        Route::get('/team-members/create', [TeamMemberController::class, 'create'])->name('create');
        Route::post('/team-members', [TeamMemberController::class, 'store'])->name('store');
        Route::get('/team-members/{id}/edit', [TeamMemberController::class, 'edit'])->name('edit');
        Route::put('/team-members/{id}', [TeamMemberController::class, 'update'])->name('update');
        Route::delete('/team-members/{id}', [TeamMemberController::class, 'destroy'])->name('destroy');
    });

    Route::name('team-settings.')->group(function () {
        Route::get('/team-settings', [TeamSettingsController::class, 'edit'])->name('edit');
        Route::put('/team-settings', [TeamSettingsController::class, 'update'])->name('update');
    });
});

use App\Http\Controllers\Admin\BuildingOptionController;
use App\Http\Controllers\Admin\BuildingArticleController;
use App\Http\Controllers\Admin\BuildingOptionsSettingsController;

// Admin Building Options Routes (Protected by auth middleware)
Route::middleware(['auth'])->prefix('admin')->group(function () {
    Route::name('building-options.')->group(function () {
        Route::get('/building-options', [BuildingOptionController::class, 'index'])->name('index');
        Route::get('/building-options/create', [BuildingOptionController::class, 'create'])->name('create');
        Route::post('/building-options', [BuildingOptionController::class, 'store'])->name('store');
        Route::get('/building-options/{id}/edit', [BuildingOptionController::class, 'edit'])->name('edit');
        Route::put('/building-options/{id}', [BuildingOptionController::class, 'update'])->name('update');
        Route::delete('/building-options/{id}', [BuildingOptionController::class, 'destroy'])->name('destroy');
    });

    Route::name('building-articles.')->group(function () {
        Route::get('/building-articles', [BuildingArticleController::class, 'index'])->name('index');
        Route::get('/building-articles/create', [BuildingArticleController::class, 'create'])->name('create');
        Route::post('/building-articles', [BuildingArticleController::class, 'store'])->name('store');
        Route::get('/building-articles/{id}/edit', [BuildingArticleController::class, 'edit'])->name('edit');
        Route::put('/building-articles/{id}', [BuildingArticleController::class, 'update'])->name('update');
        Route::delete('/building-articles/{id}', [BuildingArticleController::class, 'destroy'])->name('destroy');
    });

    Route::name('building-options-settings.')->group(function () {
        Route::get('/building-options-settings', [BuildingOptionsSettingsController::class, 'edit'])->name('edit');
        Route::put('/building-options-settings', [BuildingOptionsSettingsController::class, 'update'])->name('update');
    });
});

use App\Http\Controllers\Admin\HomePageController;

// Admin Home Page Routes (Protected by auth middleware)
Route::middleware(['auth'])->prefix('admin')->name('home.')->group(function () {
    Route::get('/home', [HomePageController::class, 'index'])->name('index');
    Route::put('/home/first-section', [HomePageController::class, 'updateFirstSection'])->name('first-section.update');
    Route::put('/home/hero', [HomePageController::class, 'updateHero'])->name('hero.update');
    Route::put('/home/services', [HomePageController::class, 'updateServices'])->name('services.update');
    Route::put('/home/grid-section', [HomePageController::class, 'updateGridSection'])->name('grid-section.update');
    Route::put('/home/settings', [HomePageController::class, 'updateSettings'])->name('settings.update');
});

use App\Http\Controllers\Admin\HomeHeroSectionController;
use App\Http\Controllers\Admin\HomeServiceLinkController;
use App\Http\Controllers\Admin\HomeGridLinkController;
use App\Http\Controllers\Admin\HomeTestimonialController;

Route::middleware(['auth'])->prefix('admin')->group(function () {
    // Hero Sections
    Route::name('home-hero-sections.')->group(function () {
        Route::get('/home-hero-sections', [HomeHeroSectionController::class, 'index'])->name('index');
        Route::get('/home-hero-sections/create', [HomeHeroSectionController::class, 'create'])->name('create');
        Route::post('/home-hero-sections', [HomeHeroSectionController::class, 'store'])->name('store');
        Route::get('/home-hero-sections/{id}/edit', [HomeHeroSectionController::class, 'edit'])->name('edit');
        Route::put('/home-hero-sections/{id}', [HomeHeroSectionController::class, 'update'])->name('update');
        Route::delete('/home-hero-sections/{id}', [HomeHeroSectionController::class, 'destroy'])->name('destroy');
    });

    // Service Links
    Route::name('home-service-links.')->group(function () {
        Route::get('/home-service-links', [HomeServiceLinkController::class, 'index'])->name('index');
        Route::get('/home-service-links/create', [HomeServiceLinkController::class, 'create'])->name('create');
        Route::post('/home-service-links', [HomeServiceLinkController::class, 'store'])->name('store');
        Route::get('/home-service-links/{id}/edit', [HomeServiceLinkController::class, 'edit'])->name('edit');
        Route::put('/home-service-links/{id}', [HomeServiceLinkController::class, 'update'])->name('update');
        Route::delete('/home-service-links/{id}', [HomeServiceLinkController::class, 'destroy'])->name('destroy');
    });

    // Grid Links
    Route::name('home-grid-links.')->group(function () {
        Route::get('/home-grid-links', [HomeGridLinkController::class, 'index'])->name('index');
        Route::get('/home-grid-links/create', [HomeGridLinkController::class, 'create'])->name('create');
        Route::post('/home-grid-links', [HomeGridLinkController::class, 'store'])->name('store');
        Route::get('/home-grid-links/{id}/edit', [HomeGridLinkController::class, 'edit'])->name('edit');
        Route::put('/home-grid-links/{id}', [HomeGridLinkController::class, 'update'])->name('update');
        Route::delete('/home-grid-links/{id}', [HomeGridLinkController::class, 'destroy'])->name('destroy');
    });

    // Testimonials
    Route::name('home-testimonials.')->group(function () {
        Route::get('/home-testimonials', [HomeTestimonialController::class, 'index'])->name('index');
        Route::get('/home-testimonials/create', [HomeTestimonialController::class, 'create'])->name('create');
        Route::post('/home-testimonials', [HomeTestimonialController::class, 'store'])->name('store');
        Route::get('/home-testimonials/{id}/edit', [HomeTestimonialController::class, 'edit'])->name('edit');
        Route::put('/home-testimonials/{id}', [HomeTestimonialController::class, 'update'])->name('update');
        Route::delete('/home-testimonials/{id}', [HomeTestimonialController::class, 'destroy'])->name('destroy');
    });
});

use App\Http\Controllers\Admin\LayoutController;
use App\Http\Controllers\Admin\NavigationLinkController;
use App\Http\Controllers\Admin\FooterLinkController;
use App\Http\Controllers\Admin\SocialLinkController;

Route::middleware(['auth'])->prefix('admin')->group(function () {
    // Layout
    Route::name('layout.')->group(function () {
        Route::get('/layout', [LayoutController::class, 'index'])->name('index');
        Route::put('/layout/navigation', [LayoutController::class, 'updateNavigation'])->name('navigation.update');
        Route::put('/layout/contact-info', [LayoutController::class, 'updateContactInfo'])->name('contact-info.update');
    });

    // Navigation Links
    Route::name('navigation-links.')->group(function () {
        Route::get('/navigation-links', [NavigationLinkController::class, 'index'])->name('index');
        Route::get('/navigation-links/create', [NavigationLinkController::class, 'create'])->name('create');
        Route::post('/navigation-links', [NavigationLinkController::class, 'store'])->name('store');
        Route::get('/navigation-links/{id}/edit', [NavigationLinkController::class, 'edit'])->name('edit');
        Route::put('/navigation-links/{id}', [NavigationLinkController::class, 'update'])->name('update');
        Route::delete('/navigation-links/{id}', [NavigationLinkController::class, 'destroy'])->name('destroy');
    });

    // Footer Links
    Route::name('footer-links.')->group(function () {
        Route::get('/footer-links', [FooterLinkController::class, 'index'])->name('index');
        Route::get('/footer-links/create', [FooterLinkController::class, 'create'])->name('create');
        Route::post('/footer-links', [FooterLinkController::class, 'store'])->name('store');
        Route::get('/footer-links/{id}/edit', [FooterLinkController::class, 'edit'])->name('edit');
        Route::put('/footer-links/{id}', [FooterLinkController::class, 'update'])->name('update');
        Route::delete('/footer-links/{id}', [FooterLinkController::class, 'destroy'])->name('destroy');
    });

    // Social Links
    Route::name('social-links.')->group(function () {
        Route::get('/social-links', [SocialLinkController::class, 'index'])->name('index');
        Route::get('/social-links/create', [SocialLinkController::class, 'create'])->name('create');
        Route::post('/social-links', [SocialLinkController::class, 'store'])->name('store');
        Route::get('/social-links/{id}/edit', [SocialLinkController::class, 'edit'])->name('edit');
        Route::put('/social-links/{id}', [SocialLinkController::class, 'update'])->name('update');
        Route::delete('/social-links/{id}', [SocialLinkController::class, 'destroy'])->name('destroy');
    });
});

use App\Http\Controllers\Admin\ContentPageController;

// Admin Content Pages Routes (Protected by auth middleware)
Route::middleware(['auth'])->prefix('admin')->group(function () {
    Route::get('/about-us', [ContentPageController::class, 'aboutUs'])->name('about-us.edit');
    Route::put('/about-us', [ContentPageController::class, 'updateAboutUs'])->name('about-us.update');
    
    Route::get('/privacy-policy', [ContentPageController::class, 'privacyPolicy'])->name('privacy-policy.edit');
    Route::put('/privacy-policy', [ContentPageController::class, 'updatePrivacyPolicy'])->name('privacy-policy.update');
});

use App\Http\Controllers\Admin\FloorPlanController;

// Admin Floor Plans Routes (Protected by auth middleware)
Route::middleware(['auth'])->prefix('admin')->name('floor-plans.')->group(function () {
    Route::get('/floor-plans', [FloorPlanController::class, 'index'])->name('index');
    Route::get('/floor-plans/create', [FloorPlanController::class, 'create'])->name('create');
    Route::post('/floor-plans', [FloorPlanController::class, 'store'])->name('store');
    Route::get('/floor-plans/{id}/edit', [FloorPlanController::class, 'edit'])->name('edit');
    Route::put('/floor-plans/{id}', [FloorPlanController::class, 'update'])->name('update');
    Route::delete('/floor-plans/{id}', [FloorPlanController::class, 'destroy'])->name('destroy');
});
use App\Http\Controllers\Admin\GallerySettingsController;

// Inside the gallery-albums group or as a separate group
Route::middleware(['auth'])->prefix('admin')->group(function () {
    // Gallery Settings
    Route::get('/gallery-settings', [GallerySettingsController::class, 'edit'])->name('gallery-settings.edit');
    Route::put('/gallery-settings', [GallerySettingsController::class, 'update'])->name('gallery-settings.update');
});
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
