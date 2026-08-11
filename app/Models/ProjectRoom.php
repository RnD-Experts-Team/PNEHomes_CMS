<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HasMediaUrl;

class ProjectRoom extends Model
{
    use HasFactory, HasMediaUrl;

    protected $fillable = [
        'lot_id',
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

    public function getCoverUrlAttribute(): ?string
    {
        return $this->resolveMediaUrl($this->cover_image_id, $this->cover_image_type);
    }

    public function lot()
    {
        return $this->belongsTo(ProjectLot::class, 'lot_id');
    }

    public function images()
    {
        return $this->hasMany(ProjectImage::class, 'room_id')->orderBy('order');
    }

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($room) {
            $room->images()->delete();
        });
    }
}
