<?php

// app/Models/CommunitiesSetting.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CommunitiesSetting extends Model
{
    protected $table = 'communities_settings';
    protected $fillable = ['title','cover_image_id','zillow_link'];
    protected $appends = ['cover_url'];

    public function getCoverUrlAttribute(): ?string
    {
        return $this->cover_image_id
            ? config('media.image_base_url').'/'.$this->cover_image_id
            : null;
    }
}
