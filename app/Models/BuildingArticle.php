<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BuildingArticle extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'title',
        'description',
        'image_id',
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
        return config('media.image_base_url') . '/' . $this->image_id;
    }
}
