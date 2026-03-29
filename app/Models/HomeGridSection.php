<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HasMediaUrl;

class HomeGridSection extends Model
{
    use HasFactory, HasMediaUrl;

    protected $table = 'home_grid_section';

    protected $fillable = [
        'video_id',
        'logo_image_id',
        'video_type',
        'logo_image_type',
    ];

    protected $appends = ['video_url', 'logo_url'];

    public function getVideoUrlAttribute(): string
    {
        return $this->resolveMediaUrl($this->video_id, $this->video_type);
    }

    public function getLogoUrlAttribute(): string
    {
        return $this->resolveMediaUrl($this->logo_image_id, $this->logo_image_type);
    }
}
