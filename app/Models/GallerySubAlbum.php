<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HasMediaUrl;

class GallerySubAlbum extends Model
{
    use HasFactory, HasMediaUrl;

    protected $fillable = [
        'album_id',
        'slug',
        'title',
        'cover_image_id',
        'cover_image_type',
        'order',
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    protected $appends = ['cover_url'];

    public function getCoverUrlAttribute(): string
    {
        return $this->resolveMediaUrl($this->cover_image_id, $this->cover_image_type);
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
