<?php

namespace App\Services;

use App\Models\Property;
use App\Models\PropertyGallery;
use App\Models\PropertyWhatsSpecial;
use App\Models\PropertyFactsFeature;
use App\Models\PropertyFloorPlan;
use App\Models\PropertySettings;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class PropertyService
{
    // ============ Settings Methods ============
    
    public function getSettings(): PropertySettings
    {
        return PropertySettings::firstOrCreate([], [
            'title' => 'Floor Plans',
            'cover_image_id' => '',
            'contact_title' => 'Contact Us',
            'contact_message' => "I'm contacting you to ask about the property {propertyTitle}",
        ]);
    }

    public function updateSettings(array $data): PropertySettings
    {
        $settings = $this->getSettings();
        $settings->update([
            'title' => $data['title'] ?? $settings->title,
            'cover_image_id' => $data['cover_image_id'] ?? $settings->cover_image_id,
            'contact_title' => $data['contact_title'] ?? $settings->contact_title,
            'contact_message' => $data['contact_message'] ?? $settings->contact_message,
        ]);
        return $settings->refresh();
    }

    // ============ Property Methods ============

    public function getAllProperties(array $filters = [])
    {
        $query = Property::where('is_active', true);

        // Apply filters
        if (!empty($filters['community'])) {
            $searchCommunity = strtolower(trim($filters['community']));
            $query->whereRaw('LOWER(community) LIKE ?', ['%' . $searchCommunity . '%']);
        }

        if (!empty($filters['price'])) {
            $query->whereRaw('CAST(REPLACE(REPLACE(price, "$", ""), ",", "") AS UNSIGNED) <= ?', [$filters['price']]);
        }

        if (!empty($filters['beds'])) {
            $query->whereRaw('CAST(beds AS UNSIGNED) >= ?', [$filters['beds']]);
        }

        if (!empty($filters['baths'])) {
            $query->whereRaw('CAST(baths AS DECIMAL(10,1)) >= ?', [$filters['baths']]);
        }

        if (!empty($filters['garages'])) {
            $query->whereRaw('CAST(garages AS UNSIGNED) >= ?', [$filters['garages']]);
        }

        if (!empty($filters['min'])) {
            $query->whereRaw('CAST(REPLACE(REPLACE(price, "$", ""), ",", "") AS UNSIGNED) >= ?', [$filters['min']]);
        }

        if (!empty($filters['max'])) {
            $query->whereRaw('CAST(REPLACE(REPLACE(price, "$", ""), ",", "") AS UNSIGNED) <= ?', [$filters['max']]);
        }

        // Sorting
        $sortBy = $filters['sortBy'] ?? 'sqft';
        $sortOrder = $filters['sortOrder'] ?? 'desc';

        switch ($sortBy) {
            case 'price':
                $query->orderByRaw('CAST(REPLACE(REPLACE(price, "$", ""), ",", "") AS UNSIGNED) ' . $sortOrder);
                break;
            case 'sqft':
                $query->orderByRaw('CAST(REPLACE(sqft, ",", "") AS UNSIGNED) ' . $sortOrder);
                break;
            case 'order':
                $query->orderBy('order', $sortOrder);
                break;
            case 'id':
            default:
                $query->orderBy('id', $sortOrder);
                break;
        }

        // Pagination
        $page = $filters['page'] ?? 1;
        $limit = $filters['limit'] ?? 9;
        $offset = ($page - 1) * $limit;

        return $query->skip($offset)->take($limit)->get();
    }

    public function getTotalCount(array $filters = []): int
    {
        $query = Property::where('is_active', true);

        // Apply same filters
        if (!empty($filters['community'])) {
            $searchCommunity = strtolower(trim($filters['community']));
            $query->whereRaw('LOWER(community) LIKE ?', ['%' . $searchCommunity . '%']);
        }

        if (!empty($filters['price'])) {
            $query->whereRaw('CAST(REPLACE(REPLACE(price, "$", ""), ",", "") AS UNSIGNED) <= ?', [$filters['price']]);
        }

        if (!empty($filters['beds'])) {
            $query->whereRaw('CAST(beds AS UNSIGNED) >= ?', [$filters['beds']]);
        }

        if (!empty($filters['baths'])) {
            $query->whereRaw('CAST(baths AS DECIMAL(10,1)) >= ?', [$filters['baths']]);
        }

        if (!empty($filters['garages'])) {
            $query->whereRaw('CAST(garages AS UNSIGNED) >= ?', [$filters['garages']]);
        }

        if (!empty($filters['min'])) {
            $query->whereRaw('CAST(REPLACE(REPLACE(price, "$", ""), ",", "") AS UNSIGNED) >= ?', [$filters['min']]);
        }

        if (!empty($filters['max'])) {
            $query->whereRaw('CAST(REPLACE(REPLACE(price, "$", ""), ",", "") AS UNSIGNED) <= ?', [$filters['max']]);
        }

        return $query->count();
    }

    public function getUniqueCommunities(): array
    {
        return Property::where('is_active', true)
            ->distinct()
            ->pluck('community')
            ->filter()
            ->sort()
            ->values()
            ->toArray();
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
            $property = Property::create([
                'title' => $data['title'],
                'community' => $data['community'],
                'price' => $data['price'],
                'beds' => $data['beds'],
                'baths' => $data['baths'],
                'garages' => $data['garages'],
                'sqft' => $data['sqft'],
                'zillow_link' => $data['zillow_link'] ?? null,
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
                    'description' => $data['whats_special']['description'] ?? '',
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
                        'description' => $plan['description'] ?? '',
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

            $property->update([
                'title' => $data['title'] ?? $property->title,
                'community' => $data['community'] ?? $property->community,
                'price' => $data['price'] ?? $property->price,
                'beds' => $data['beds'] ?? $property->beds,
                'baths' => $data['baths'] ?? $property->baths,
                'garages' => $data['garages'] ?? $property->garages,
                'sqft' => $data['sqft'] ?? $property->sqft,
                'zillow_link' => $data['zillow_link'] ?? $property->zillow_link,
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
                        'description' => $data['whats_special']['description'] ?? '',
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
                        'description' => $plan['description'] ?? '',
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
}
