<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
        'next_property_slug',
        'prev_property_slug',
        'cover_image_id',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    protected $appends = ['cover_url'];

    public function getCoverUrlAttribute(): ?string
    {
        return $this->cover_image_id
            ? config('media.image_base_url') . '/' . $this->cover_image_id
            : null;
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

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($property) {
            $property->gallery()->delete();
            $property->whatsSpecial()->delete();
            $property->factsFeatures()->delete();
            $property->floorPlans()->delete();
        });
    }
}
