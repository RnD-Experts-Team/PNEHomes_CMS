<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GalleryAlbum extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'title',
        'cover_virtual_image_id',
        'cover_real_image_id',
        'has_sub_albums',
        'order',
        'is_active',
    ];

    protected $casts = [
        'has_sub_albums' => 'boolean',
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    protected $appends = ['cover_virtual_url', 'cover_real_url'];

    public function getCoverVirtualUrlAttribute(): string
    {
        return config('media.image_base_url') . '/' . $this->cover_virtual_image_id;
    }

    public function getCoverRealUrlAttribute(): string
    {
        return config('media.image_base_url') . '/' . $this->cover_real_image_id;
    }

    public function subAlbums()
    {
        return $this->hasMany(GallerySubAlbum::class, 'album_id')->orderBy('order');
    }

    public function images()
    {
        return $this->hasMany(GalleryImage::class, 'album_id')->whereNull('sub_album_id')->orderBy('order');
    }

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($album) {
            $album->subAlbums()->delete();
            $album->images()->delete();
        });
    }
}
