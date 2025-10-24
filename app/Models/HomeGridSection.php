<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HomeGridSection extends Model
{
    use HasFactory;

    protected $table = 'home_grid_section';

    protected $fillable = [
        'video_id',
        'logo_image_id',
    ];

    protected $appends = ['video_url', 'logo_url'];

    public function getVideoUrlAttribute(): string
    {
        return config('media.video_base_url') . '/' . $this->video_id . '/preview';
    }

    public function getLogoUrlAttribute(): string
    {
        return config('media.image_base_url') . '/' . $this->logo_image_id;
    }
}
