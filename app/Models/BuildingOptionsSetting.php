<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HasMediaUrl;

class BuildingOptionsSetting extends Model
{
    use HasFactory, HasMediaUrl;

    protected $fillable = [
        'cover_image_id',
        'articles_cover_image_id',
        'slogan',
        'title',
        'cover_image_type',
        'articles_cover_image_type',
    ];

    protected $appends = ['cover_url', 'articles_cover_url'];

    public function getCoverUrlAttribute(): string
    {
        return $this->resolveMediaUrl(
            $this->cover_image_id,
            $this->cover_image_type
        );
    }

    public function getArticlesCoverUrlAttribute(): string
    {
        return $this->resolveMediaUrl(
            $this->articles_cover_image_id,
            $this->articles_cover_image_type
        );
    }
}
