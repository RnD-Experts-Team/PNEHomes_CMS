<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HasMediaUrl;

class Event extends Model
{
    use HasFactory, HasMediaUrl;

    protected $fillable = [
        'title',
        'description',
        'cover_image_id',
        'cover_image_type',
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
            ? $this->resolveMediaUrl($this->cover_image_id, $this->cover_image_type)
            : null;
    }

    public function gallery()
    {
        return $this->hasMany(EventGallery::class)->orderBy('order');
    }

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($event) {
            $event->gallery()->delete();
        });
    }
}
