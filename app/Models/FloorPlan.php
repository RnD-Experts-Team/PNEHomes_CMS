<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HasMediaUrl;

class FloorPlan extends Model
{
    use HasFactory, HasMediaUrl;

    protected $fillable = [
        'slug',
        'title',
        'description',
        'image_id',
        'image_type',
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
        return $this->resolveMediaUrl($this->image_id, $this->image_type);
    }
}
