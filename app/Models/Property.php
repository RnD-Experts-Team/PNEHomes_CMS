<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'title',
        'community',
        'price',
        'beds',
        'baths',
        'garages',
        'sqft',
        'zillow_link',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function (Property $property) {
            // If slug not provided, derive from title
            $base = $property->slug ?: $property->title;
            $property->slug = static::generateUniqueSlug($base);
        });

        static::updating(function (Property $property) {
            // If slug was explicitly set in update payload, honor it (but make unique)
            if ($property->isDirty('slug')) {
                $property->slug = static::generateUniqueSlug($property->slug, $property->id);
                return;
            }

            // If title changed, regenerate slug from title (and make unique)
            if ($property->isDirty('title')) {
                $property->slug = static::generateUniqueSlug($property->title, $property->id);
            }
        });

        static::deleting(function (Property $property) {
            $property->gallery()->delete();
            $property->whatsSpecial()->delete();
            $property->factsFeatures()->delete();
            $property->floorPlans()->delete();
        });
    }

    /**
     * Generate a unique slug: "my-home", "my-home-1", "my-home-2", ...
     *
     * @param string $value Title or slug input
     * @param int|null $ignoreId Exclude this ID (for updates)
     */
    public static function generateUniqueSlug(string $value, ?int $ignoreId = null): string
    {
        $slug = Str::slug($value);

        // Fallback if title is all symbols / becomes empty
        if ($slug === '') {
            $slug = 'property';
        }

        $original = $slug;
        $counter = 1;

        while (static::query()
            ->when($ignoreId, fn($q) => $q->where('id', '!=', $ignoreId))
            ->where('slug', $slug)
            ->exists()
        ) {
            $slug = $original . '-' . $counter;
            $counter++;
        }

        return $slug;
    }

    public function gallery()
    {
        return $this->hasMany(PropertyGallery::class)->orderBy('order');
    }

    public function whatsSpecial()
    {
        return $this->hasOne(PropertyWhatsSpecial::class);
    }

    public function factsFeatures()
    {
        return $this->hasMany(PropertyFactsFeature::class)->orderBy('order');
    }

    public function floorPlans()
    {
        return $this->hasMany(PropertyFloorPlan::class)->orderBy('order');
    }
}
