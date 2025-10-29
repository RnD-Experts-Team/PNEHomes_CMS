<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PropertySettings extends Model
{
    protected $table = 'property_settings';
    
    protected $fillable = [
        'title',
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
