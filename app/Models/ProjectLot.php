<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HasMediaUrl;

class ProjectLot extends Model
{
    use HasFactory, HasMediaUrl;

    protected $fillable = [
        'slug',
        'title',
        'cover_image_id',
        'cover_image_type',
        'has_rooms',
        'order',
        'is_active',
    ];

    protected $casts = [
        'has_rooms' => 'boolean',
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    protected $appends = ['cover_url'];

    public function getCoverUrlAttribute(): ?string
    {
        return $this->resolveMediaUrl($this->cover_image_id, $this->cover_image_type);
    }

    public function rooms()
    {
        return $this->hasMany(ProjectRoom::class, 'lot_id')->orderBy('order');
    }

    public function images()
    {
        return $this->hasMany(ProjectImage::class, 'lot_id')->whereNull('room_id')->orderBy('order');
    }

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($lot) {
            $lot->rooms()->delete();
            $lot->images()->delete();
        });
    }
}
