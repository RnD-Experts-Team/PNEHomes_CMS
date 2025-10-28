<?php

// app/Models/CommunitiesFloorplan.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class CommunitiesFloorplan extends Model
{
    use HasFactory;

    protected $table = 'communities_floorplans';

    protected $fillable = [
        'community_id','slug','title','cover_image_id','status',
        'price','beds','baths','garages','sqft','order','is_active',
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
            ? config('media.image_base_url').'/'.$this->cover_image_id
            : null;
    }
}
