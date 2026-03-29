<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HasMediaUrl;

class BuildingArticle extends Model
{
    use HasFactory, HasMediaUrl;

    protected $fillable = [
        'slug',
        'title',
        'description',
        'image_id',
        'image_type',
        'content',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute(): string
    {
        return $this->resolveMediaUrl(
            $this->image_id,
            $this->image_type
        );
    }
}
