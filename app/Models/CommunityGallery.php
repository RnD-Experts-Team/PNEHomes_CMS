<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HasMediaUrl;

class CommunityGallery extends Model
{
    use HasFactory, HasMediaUrl;

    protected $fillable = [
        'community_id',
        'image_id',
        'image_type',
        'order',
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    protected $appends = ['url'];

    public function getUrlAttribute(): string
    {
        return $this->resolveMediaUrl($this->image_id, $this->image_type);
    }

    public function community()
    {
        return $this->belongsTo(Community::class);
    }
}
