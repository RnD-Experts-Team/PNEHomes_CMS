<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HasMediaUrl;

class HomeFirstSection extends Model
{
    use HasFactory, HasMediaUrl;

    protected $table = 'home_first_section';

    protected $fillable = [
        'mobile_cover_image_id',
        'logo_image_id',
        'mobile_cover_image_type',
        'logo_image_type',
        'title',
        'subtitle',
        'book_button_text',
    ];

    protected $appends = ['mobile_cover_url', 'logo_url'];



    public function getMobileCoverUrlAttribute(): string
    {
        return $this->resolveMediaUrl($this->mobile_cover_image_id, $this->mobile_cover_image_type);
    }

    public function getLogoUrlAttribute(): string
    {
        return $this->resolveMediaUrl($this->logo_image_id, $this->logo_image_type);
    }
}
