<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FloorPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'title',
        'description',
        'image_id',
        'bedroom',
        'bathroom',
        'floor',
        'area',
        'order',
        'is_active',
    ];

    protected $casts = [
        'bedroom' => 'integer',
        'bathroom' => 'integer',
        'floor' => 'integer',
        'area' => 'integer',
        'order' => 'integer',
        'is_active' => 'boolean',
    ];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute(): string
    {
        return config('media.image_base_url') . '/' . $this->image_id;
    }
}
