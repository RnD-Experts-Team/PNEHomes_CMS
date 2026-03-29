<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HasMediaUrl;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'title',
        'sub_title',
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
