<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HasMediaUrl;

class EventSetting extends Model
{
    use HasFactory, HasMediaUrl;

    protected $fillable = [
        'cover_image_id',
        'cover_image_type',
        'slogan',
        'title',
        'contact_title',
        'contact_message',
    ];

    protected $appends = ['cover_url'];

    public function getCoverUrlAttribute(): string
    {
        return $this->resolveMediaUrl($this->cover_image_id, $this->cover_image_type);
    }
}
