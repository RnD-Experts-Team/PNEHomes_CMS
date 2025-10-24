<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommunityGallery extends Model
{
    use HasFactory;

    protected $fillable = [
        'community_id',
        'image_id',
        'order',
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    protected $appends = ['url'];

    public function getUrlAttribute(): string
    {
        return config('media.image_base_url') . '/' . $this->image_id;
    }

    public function community()
    {
        return $this->belongsTo(Community::class);
    }
}
