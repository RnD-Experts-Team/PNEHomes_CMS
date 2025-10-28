<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HomeFirstSection extends Model
{
    use HasFactory;

    protected $table = 'home_first_section';

    protected $fillable = [
        'mobile_cover_image_id',
        'logo_image_id',
        'title',
        'subtitle',
        'book_button_text',
    ];

    protected $appends = [ 'mobile_cover_url', 'logo_url'];



    public function getMobileCoverUrlAttribute(): string
    {
        return config('media.image_base_url') . '/' . $this->mobile_cover_image_id;
    }

    public function getLogoUrlAttribute(): string
    {
        return config('media.image_base_url') . '/' . $this->logo_image_id;
    }
}
