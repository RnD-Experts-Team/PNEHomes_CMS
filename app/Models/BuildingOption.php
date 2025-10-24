<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BuildingOption extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'section_image_id',
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
        return config('media.image_base_url') . '/' . $this->section_image_id;
    }
}
