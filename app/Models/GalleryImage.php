<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HasMediaUrl;

class GalleryImage extends Model
{
    use HasFactory, HasMediaUrl;

    protected $fillable = [
        'album_id',
        'sub_album_id',
        'virtual_image_id',
        'real_image_id',
        'virtual_image_type',
        'real_image_type',
        'order',
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    protected $appends = ['virtual_url', 'real_url'];

    public function getVirtualUrlAttribute(): ?string
    {
        return $this->virtual_image_id
            ? $this->resolveMediaUrl($this->virtual_image_id, $this->virtual_image_type)
            : null;
    }

    public function getRealUrlAttribute(): ?string
    {
        return $this->real_image_id
            ? $this->resolveMediaUrl($this->real_image_id, $this->real_image_type)
            : null;
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
