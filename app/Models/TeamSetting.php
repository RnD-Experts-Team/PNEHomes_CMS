<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeamSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'cover_image_id',
        'slogan',
        'title',
        'subtitle',
        'description',
        'contact_title',
        'contact_message',
    ];

    protected $appends = ['cover_url'];

    public function getCoverUrlAttribute(): string
    {
        return config('media.image_base_url') . '/' . $this->cover_image_id;
    }
}
