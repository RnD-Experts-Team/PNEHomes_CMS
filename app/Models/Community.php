<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HasMediaUrl;

class Community extends Model
{
    use HasFactory, HasMediaUrl;

    protected $fillable = [
        'slug',
        'title',
        'city',
        'address',
        'latitude',
        'longitude',
        'card_image_id',
        'card_image_type',
        'video_id',
        'video_type',
        'community_features',
        'starting_price',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
        'latitude' => 'float',
        'longitude' => 'float',
    ];

    protected $appends = ['card_image_url', 'video_url'];

    public function getCardImageUrlAttribute(): ?string
    {
        return $this->card_image_id
            ? $this->resolveMediaUrl($this->card_image_id, $this->card_image_type)
            : null;
    }

    public function getVideoUrlAttribute(): ?string
    {
        return $this->video_id
            ? $this->resolveMediaUrl($this->video_id, $this->video_type)
            : null;
    }

    public function gallery()
    {
        return $this->hasMany(CommunityGallery::class)->orderBy('order');
    }
    public function floorplans()   // relation name matches table
    {
        return $this->hasMany(CommunitiesFloorplan::class)->orderBy('order');
    }

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($community) {
            $community->gallery()->delete();
            $community->floorplans()->delete();
        });
    }
}
