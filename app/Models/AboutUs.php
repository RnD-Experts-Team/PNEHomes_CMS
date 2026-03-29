<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HasMediaUrl;

class AboutUs extends Model
{
    use HasFactory, HasMediaUrl;

    protected $table = 'about_us';

    protected $fillable = [
        'cover_image_id',
        'cover_image_type',
        'slogan',
        'title',
        'content',
    ];

    protected $appends = ['cover_url'];

    public function getCoverUrlAttribute(): string
    {
        return $this->resolveMediaUrl(
            $this->cover_image_id,
            $this->cover_image_type
        );
    }
}
