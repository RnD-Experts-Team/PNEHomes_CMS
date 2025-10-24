<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BuildingOptionsSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'cover_image_id',
        'articles_cover_image_id',
        'slogan',
        'title',
    ];

    protected $appends = ['cover_url', 'articles_cover_url'];

    public function getCoverUrlAttribute(): string
    {
        return config('media.image_base_url') . '/' . $this->cover_image_id;
    }

    public function getArticlesCoverUrlAttribute(): string
    {
        return config('media.image_base_url') . '/' . $this->articles_cover_image_id;
    }
}
