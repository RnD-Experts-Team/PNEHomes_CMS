<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PropertyGallery extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_id',
        'image_id',
        'order',
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    protected $appends = ['url'];

    public function getUrlAttribute(): string
    {
        return config('media.image_base_url') . '/' . $this->image_id;
    }

    public function property()
    {
        return $this->belongsTo(Property::class);
    }
}
