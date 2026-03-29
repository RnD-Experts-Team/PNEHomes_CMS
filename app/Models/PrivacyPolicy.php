<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HasMediaUrl;

class PrivacyPolicy extends Model
{
    use HasFactory, HasMediaUrl;

    protected $table = 'privacy_policy';

    protected $fillable = [
        'title',
        'slogan',
        'description',
        'cover_image_id',
        'cover_image_type',
        'contact_title',
        'contact_message',
    ];

    protected $appends = ['cover_url'];

    public function getCoverUrlAttribute(): ?string
    {
        return $this->cover_image_id
            ? $this->resolveMediaUrl($this->cover_image_id, $this->cover_image_type)
            : null;
    }
}
