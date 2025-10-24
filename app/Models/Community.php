<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Community extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'title',
        'city',
        'address',
        'card_image_id',
        'video_id',
        'community_features',
        'starting_price',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    protected $appends = ['card_image_url', 'video_url'];

    public function getCardImageUrlAttribute(): ?string
    {
        return $this->card_image_id
            ? config('media.image_base_url') . '/' . $this->card_image_id
            : null;
    }

    public function getVideoUrlAttribute(): ?string
    {
        return $this->video_id
            ? config('media.video_base_url') . '/' . $this->video_id . '/preview'
            : null;
    }

    public function gallery()
    {
        return $this->hasMany(CommunityGallery::class)->orderBy('order');
    }

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($community) {
            $community->gallery()->delete();
        });
    }
}
