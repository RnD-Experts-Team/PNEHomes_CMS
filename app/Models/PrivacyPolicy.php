<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrivacyPolicy extends Model
{
    use HasFactory;

    protected $table = 'privacy_policy';

    protected $fillable = [
        'title',
        'slogan',
        'description',
        'cover_image_id',
        'contact_title',
        'contact_message',
    ];

    protected $appends = ['cover_url'];

    public function getCoverUrlAttribute(): ?string
    {
        return $this->cover_image_id
            ? config('media.image_base_url') . '/' . $this->cover_image_id
            : null;
    }
}
