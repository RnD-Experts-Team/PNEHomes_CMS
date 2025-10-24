<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'title',
        'sub_title',
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

    public function contentItems()
    {
        return $this->hasMany(ServiceContentItem::class)->orderBy('order');
    }

    public function contact()
    {
        return $this->hasOne(ServiceContact::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($service) {
            $service->contentItems()->delete();
            $service->contact()->delete();
        });
    }
}
