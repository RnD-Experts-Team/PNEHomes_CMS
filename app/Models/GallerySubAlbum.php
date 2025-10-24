<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GallerySubAlbum extends Model
{
    use HasFactory;

    protected $fillable = [
        'album_id',
        'slug',
        'title',
        'cover_virtual_image_id',
        'cover_real_image_id',
        'order',
    ];

    protected $casts = [
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

    public function album()
    {
        return $this->belongsTo(GalleryAlbum::class, 'album_id');
    }

    public function images()
    {
        return $this->hasMany(GalleryImage::class, 'sub_album_id')->orderBy('order');
    }

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($subAlbum) {
            $subAlbum->images()->delete();
        });
    }
}
