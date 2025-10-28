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
        'cover_image_id',
        'order',
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    protected $appends = ['cover_url'];

    public function getCoverUrlAttribute(): string
    {
        return config('media.image_base_url') . '/' . $this->cover_image_id;
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
