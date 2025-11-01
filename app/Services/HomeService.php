<?php

namespace App\Services;

use App\Models\HomeFirstSection;
use App\Models\HomeHeroSection;
use App\Models\HomeHero;
use App\Models\HomeService as HomeServiceModel;
use App\Models\HomeServiceLink;
use App\Models\HomeGridSection;
use App\Models\HomeGridLink;
use App\Models\HomeTestimonial;
use App\Models\HomeSetting;
use Illuminate\Support\Str;

class HomeService
{
    public function getHomeData()
    {
        $firstSection = HomeFirstSection::first();
        $heroSections = HomeHeroSection::orderBy('order')->get();
        $hero = HomeHero::first();
        $services = HomeServiceModel::first();
        $serviceLinks = HomeServiceLink::orderBy('order')->get();
        $gridSection = HomeGridSection::first();
        $gridLinks = HomeGridLink::orderBy('order')->get();
        $testimonials = HomeTestimonial::where('is_active', true)->orderBy('order')->get();
        $settings = HomeSetting::first();

        return [
            'first_section' => $firstSection,
            'hero_sections' => $heroSections,
            'hero' => $hero,
            'services' => $services,
            'service_links' => $serviceLinks,
            'grid_section' => $gridSection,
            'grid_links' => $gridLinks,
            'testimonials' => $testimonials,
            'settings' => $settings,
        ];
    }

    // First Section
    public function updateFirstSection(array $data)
    {
        $section = HomeFirstSection::first();
        
        if ($section) {
            $section->update($data);
        } else {
            $section = HomeFirstSection::create($data);
        }
        
        return $section;
    }

    // Hero Sections
    public function getAllHeroSections()
    {
        return HomeHeroSection::orderBy('order')->get();
    }

    public function getHeroSectionForAdmin(int $id)
    {
        return HomeHeroSection::findOrFail($id);
    }

    public function createHeroSection(array $data)
    {
        return HomeHeroSection::create($data);
    }

    public function updateHeroSection(int $id, array $data)
    {
        $section = HomeHeroSection::findOrFail($id);
        $section->update($data);
        return $section;
    }

    public function deleteHeroSection(int $id)
    {
        $section = HomeHeroSection::findOrFail($id);
        $section->delete();
    }

    // Hero
    public function updateHero(array $data)
    {
        $hero = HomeHero::first();
        
        if ($hero) {
            $hero->update($data);
        } else {
            $hero = HomeHero::create($data);
        }
        
        return $hero;
    }

    // Services Section
    public function updateServices(array $data)
    {
        $services = HomeServiceModel::first();
        
        if ($services) {
            $services->update($data);
        } else {
            $services = HomeServiceModel::create($data);
        }
        
        return $services;
    }

    // Service Links
    public function getAllServiceLinks()
    {
        return HomeServiceLink::orderBy('order')->get();
    }

    public function getServiceLinkForAdmin(int $id)
    {
        return HomeServiceLink::findOrFail($id);
    }

    public function createServiceLink(array $data)
    {
        // slug must be auto-generated from title
        $slugBase = Str::slug($data['title']);
        $slug = $this->makeUniqueSlug($slugBase);

        return HomeServiceLink::create([
            'title' => $data['title'],
            'slug'  => $slug,
            'order' => $data['order'] ?? 0,
        ]);
    }

    public function updateServiceLink(int $id, array $data)
    {
        $link = HomeServiceLink::findOrFail($id);

        $update = [
            'title' => $data['title'],
            'order' => $data['order'] ?? 0,
        ];

        // If title changed, regenerate a unique slug
        if ($link->title !== $data['title']) {
            $slugBase = Str::slug($data['title']);
            $update['slug'] = $this->makeUniqueSlug($slugBase, $link->id);
        }

        $link->update($update);
        return $link;
    }

    protected function makeUniqueSlug(string $base, ?int $ignoreId = null): string
    {
        $slug = $base ?: 'item';

        $exists = fn(string $candidate) =>
            HomeServiceLink::where('slug', $candidate)
                ->when($ignoreId, fn($q) => $q->where('id', '!=', $ignoreId))
                ->exists(); 

        if (!$exists($slug)) {
            return $slug;
        }
        // Append -2, -3, ... until unique
        $i = 2;
        while ($exists("{$slug}-{$i}")) {
            $i++;
        }
        return "{$slug}-{$i}";
    }

    public function deleteServiceLink(int $id)
    {
        $link = HomeServiceLink::findOrFail($id);
        $link->delete();
    }

    // Grid Section
    public function updateGridSection(array $data)
    {
        $section = HomeGridSection::first();
        
        if ($section) {
            $section->update($data);
        } else {
            $section = HomeGridSection::create($data);
        }
        
        return $section;
    }

    // Grid Links
    public function getAllGridLinks()
    {
        return HomeGridLink::orderBy('order')->get();
    }

    public function getGridLinkForAdmin(int $id)
    {
        return HomeGridLink::findOrFail($id);
    }

    public function createGridLink(array $data)
    {
        return HomeGridLink::create($data);
    }

    public function updateGridLink(int $id, array $data)
    {
        $link = HomeGridLink::findOrFail($id);
        $link->update($data);
        return $link;
    }

    public function deleteGridLink(int $id)
    {
        $link = HomeGridLink::findOrFail($id);
        $link->delete();
    }

    // Testimonials
    public function getAllTestimonials()
    {
        return HomeTestimonial::orderBy('order')->get();
    }

    public function getTestimonialForAdmin(int $id)
    {
        return HomeTestimonial::findOrFail($id);
    }

    public function createTestimonial(array $data)
    {
        return HomeTestimonial::create($data);
    }

    public function updateTestimonial(int $id, array $data)
    {
        $testimonial = HomeTestimonial::findOrFail($id);
        $testimonial->update($data);
        return $testimonial;
    }

    public function deleteTestimonial(int $id)
    {
        $testimonial = HomeTestimonial::findOrFail($id);
        $testimonial->delete();
    }

    // Settings
    public function updateSettings(array $data)
    {
        $settings = HomeSetting::first();
        
        if ($settings) {
            $settings->update($data);
        } else {
            $settings = HomeSetting::create($data);
        }
        
        return $settings;
    }
}
