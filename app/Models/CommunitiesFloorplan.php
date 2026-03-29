<?php

// app/Models/CommunitiesFloorplan.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use App\Traits\HasMediaUrl;

class CommunitiesFloorplan extends Model
{
    use HasFactory, HasMediaUrl;

    protected $table = 'communities_floorplans';

    protected $fillable = [
        'community_id',
        'slug',
        'title',
        'cover_image_id',
        'cover_image_type',
        'status',
        'price',
        'beds',
        'baths',
        'garages',
        'sqft',
        'order',
        'is_active',
    ];

    protected $casts = [
        'order' => 'integer',
        'is_active' => 'boolean',
    ];

    protected $appends = ['cover_url'];

    protected static function booted()
    {
        static::creating(function (self $plan) {
            if (empty($plan->slug)) {
                $plan->slug = Str::slug($plan->title);
            }
        });
    }

    public function community()
    {
        return $this->belongsTo(Community::class);
    }

    public function getCoverUrlAttribute(): ?string
    {
        return $this->cover_image_id
            ? $this->resolveMediaUrl($this->cover_image_id, $this->cover_image_type)
            : null;
    }
}
