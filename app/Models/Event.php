<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
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
