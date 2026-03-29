<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HasMediaUrl;

class HomeGridLink extends Model
{
    use HasFactory, HasMediaUrl;

    protected $fillable = [
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
}
