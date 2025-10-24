<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HomeFirstSection extends Model
{
    use HasFactory;

    protected $table = 'home_first_section';

    protected $fillable = [
        'video_id',
        'mobile_cover_image_id',
        'logo_image_id',
        'title',
        'subtitle',
        'book_button_text',
    ];

    protected $appends = ['video_url', 'mobile_cover_url', 'logo_url'];

    public function getVideoUrlAttribute(): string
    {
        return config('media.video_base_url') . '/' . $this->video_id . '/preview';
    }

    public function getMobileCoverUrlAttribute(): string
    {
        return config('media.image_base_url') . '/' . $this->mobile_cover_image_id;
    }

    public function getLogoUrlAttribute(): string
    {
        return config('media.image_base_url') . '/' . $this->logo_image_id;
    }
}
