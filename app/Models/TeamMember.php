<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HasMediaUrl;

class TeamMember extends Model
{
    use HasFactory, HasMediaUrl;

    protected $fillable = [
        'cover_image_id',
        'cover_image_type',
        'name',
        'position',
        'description',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    protected $appends = ['cover_url'];

    public function getCoverUrlAttribute(): string
    {
        return $this->resolveMediaUrl($this->cover_image_id, $this->cover_image_type);
    }
}
