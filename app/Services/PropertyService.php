<?php

namespace App\Services;

use App\Models\Property;
use App\Models\PropertyGallery;
use App\Models\PropertyWhatsSpecial;
use App\Models\PropertyFactsFeature;
use App\Models\PropertyFloorPlan;
use App\Models\PropertyContact;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class PropertyService
{
    public function getAllProperties()
    {
        return Property::where('is_active', true)
            ->orderBy('order')
            ->get();
    }

    public function getPropertyBySlug(string $slug)
    {
        return Property::with([
            'gallery',
            'whatsSpecial',
            'factsFeatures',
            'floorPlans'
        ])
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();
    }

    public function getAllForAdmin()
    {
        return Property::orderBy('order')->orderBy('created_at', 'desc')->get();
    }

    public function getPropertyForAdmin(int $id)
    {
        return Property::with([
            'gallery',
            'whatsSpecial',
            'factsFeatures',
            'floorPlans'
        ])->findOrFail($id);
    }

    public function createProperty(array $data): Property
    {
        return DB::transaction(function () use ($data) {
            if (empty($data['slug'])) {
                $data['slug'] = Str::slug($data['title']);
            }

            $property = Property::create([
                'slug' => $data['slug'],
                'title' => $data['title'],
                'community' => $data['community'],
                'price' => $data['price'],
                'beds' => $data['beds'],
                'baths' => $data['baths'],
                'garages' => $data['garages'],
                'sqft' => $data['sqft'],
                'zillow_link' => $data['zillow_link'] ?? null,
                'next_property_slug' => $data['next_property_slug'] ?? null,
                'prev_property_slug' => $data['prev_property_slug'] ?? null,
                'cover_image_id' => $data['cover_image_id'] ?? null,
                'order' => $data['order'] ?? 0,
                'is_active' => $data['is_active'] ?? true,
            ]);

            // Create gallery
            if (!empty($data['gallery'])) {
                foreach ($data['gallery'] as $index => $imageId) {
                    PropertyGallery::create([
                        'property_id' => $property->id,
                        'image_id' => $imageId,
                        'order' => $index,
                    ]);
                }
            }

            // Create what's special
            if (!empty($data['whats_special'])) {
                PropertyWhatsSpecial::create([
                    'property_id' => $property->id,
                    'badges' => $data['whats_special']['badges'] ?? [],
                    'description' => $data['whats_special']['description'],
                ]);
            }

            // Create facts & features
            if (!empty($data['facts_features'])) {
                foreach ($data['facts_features'] as $index => $fact) {
                    PropertyFactsFeature::create([
                        'property_id' => $property->id,
                        'title' => $fact['title'],
                        'list' => $fact['list'],
                        'order' => $index,
                    ]);
                }
            }

            // Create floor plans
            if (!empty($data['floor_plans'])) {
                foreach ($data['floor_plans'] as $index => $plan) {
                    PropertyFloorPlan::create([
                        'property_id' => $property->id,
                        'title' => $plan['title'],
                        'image_id' => $plan['image_id'],
                        'description' => $plan['description'],
                        'order' => $index,
                    ]);
                }
            }

            return $property->load([
                'gallery',
                'whatsSpecial',
                'factsFeatures',
                'floorPlans'
            ]);
        });
    }

    public function updateProperty(int $id, array $data): Property
    {
        return DB::transaction(function () use ($id, $data) {
            $property = Property::findOrFail($id);

            if (empty($data['slug']) && isset($data['title'])) {
                $data['slug'] = Str::slug($data['title']);
            }

            $property->update([
                'slug' => $data['slug'] ?? $property->slug,
                'title' => $data['title'] ?? $property->title,
                'community' => $data['community'] ?? $property->community,
                'price' => $data['price'] ?? $property->price,
                'beds' => $data['beds'] ?? $property->beds,
                'baths' => $data['baths'] ?? $property->baths,
                'garages' => $data['garages'] ?? $property->garages,
                'sqft' => $data['sqft'] ?? $property->sqft,
                'zillow_link' => $data['zillow_link'] ?? $property->zillow_link,
                'next_property_slug' => $data['next_property_slug'] ?? $property->next_property_slug,
                'prev_property_slug' => $data['prev_property_slug'] ?? $property->prev_property_slug,
                'cover_image_id' => $data['cover_image_id'] ?? $property->cover_image_id,
                'order' => $data['order'] ?? $property->order,
                'is_active' => $data['is_active'] ?? $property->is_active,
            ]);

            // Update gallery
            if (isset($data['gallery'])) {
                $property->gallery()->delete();
                foreach ($data['gallery'] as $index => $imageId) {
                    PropertyGallery::create([
                        'property_id' => $property->id,
                        'image_id' => $imageId,
                        'order' => $index,
                    ]);
                }
            }

            // Update what's special
            if (isset($data['whats_special'])) {
                $property->whatsSpecial()->updateOrCreate(
                    ['property_id' => $property->id],
                    [
                        'badges' => $data['whats_special']['badges'] ?? [],
                        'description' => $data['whats_special']['description'],
                    ]
                );
            }

            // Update facts & features
            if (isset($data['facts_features'])) {
                $property->factsFeatures()->delete();
                foreach ($data['facts_features'] as $index => $fact) {
                    PropertyFactsFeature::create([
                        'property_id' => $property->id,
                        'title' => $fact['title'],
                        'list' => $fact['list'],
                        'order' => $index,
                    ]);
                }
            }

            // Update floor plans
            if (isset($data['floor_plans'])) {
                $property->floorPlans()->delete();
                foreach ($data['floor_plans'] as $index => $plan) {
                    PropertyFloorPlan::create([
                        'property_id' => $property->id,
                        'title' => $plan['title'],
                        'image_id' => $plan['image_id'],
                        'description' => $plan['description'],
                        'order' => $index,
                    ]);
                }
            }

            return $property->load([
                'gallery',
                'whatsSpecial',
                'factsFeatures',
                'floorPlans'
            ]);
        });
    }

    public function deleteProperty(int $id): void
    {
        $property = Property::findOrFail($id);
        $property->delete();
    }

    public function getContact()
    {
        return PropertyContact::first();
    }
}
