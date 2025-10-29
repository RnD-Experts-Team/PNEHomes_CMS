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

        static::creating(function ($property) {
            if (empty($property->slug)) {
                $property->slug = Str::slug($property->title);
            }
        });

        static::updating(function ($property) {
            if ($property->isDirty('title') && empty($property->slug)) {
                $property->slug = Str::slug($property->title);
            }
        });

        static::deleting(function ($property) {
            $property->gallery()->delete();
            $property->whatsSpecial()->delete();
            $property->factsFeatures()->delete();
            $property->floorPlans()->delete();
        });
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
