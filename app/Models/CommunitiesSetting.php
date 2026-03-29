<?php

// app/Models/CommunitiesSetting.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\HasMediaUrl;

class CommunitiesSetting extends Model
{
    use HasMediaUrl;
    protected $table = 'communities_settings';
    protected $fillable = ['title', 'cover_image_id', 'cover_image_type', 'zillow_link'];
    protected $appends = ['cover_url'];

    public function getCoverUrlAttribute(): ?string
    {
        return $this->cover_image_id
            ? $this->resolveMediaUrl($this->cover_image_id, $this->cover_image_type)
            : null;
    }
}
