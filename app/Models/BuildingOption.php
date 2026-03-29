<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HasMediaUrl;

class BuildingOption extends Model
{
    use HasFactory, HasMediaUrl;

    protected $fillable = [
        'title',
        'description',
        'section_image_id',
        'section_image_type',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    protected $appends = ['section_image_url'];

    public function getSectionImageUrlAttribute(): string
    {
        return $this->resolveMediaUrl(
            $this->section_image_id,
            $this->section_image_type
        );
    }
}
