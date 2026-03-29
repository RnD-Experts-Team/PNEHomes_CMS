<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HasMediaUrl;

class GalleryAlbum extends Model
{
    use HasFactory, HasMediaUrl;

    protected $fillable = [
        'slug',
        'title',
        'cover_image_id',
        'cover_image_type',
        'has_sub_albums',
        'order',
        'is_active',
    ];

    protected $casts = [
        'has_sub_albums' => 'boolean',
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    protected $appends = ['cover_url'];

    public function getCoverUrlAttribute(): string
    {
        return $this->resolveMediaUrl($this->cover_image_id, $this->cover_image_type);
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
