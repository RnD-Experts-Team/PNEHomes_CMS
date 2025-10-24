<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GalleryImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'album_id',
        'sub_album_id',
        'virtual_image_id',
        'real_image_id',
        'order',
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    protected $appends = ['virtual_url', 'real_url'];

    public function getVirtualUrlAttribute(): string
    {
        return config('media.image_base_url') . '/' . $this->virtual_image_id;
    }

    public function getRealUrlAttribute(): string
    {
        return config('media.image_base_url') . '/' . $this->real_image_id;
    }

    public function album()
    {
        return $this->belongsTo(GalleryAlbum::class, 'album_id');
    }

    public function subAlbum()
    {
        return $this->belongsTo(GallerySubAlbum::class, 'sub_album_id');
    }
}
