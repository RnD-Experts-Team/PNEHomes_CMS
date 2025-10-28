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
        'cover_image_id',
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
        return config('media.image_base_url') . '/' . $this->cover_image_id;
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
