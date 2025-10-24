<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeamMember extends Model
{
    use HasFactory;

    protected $fillable = [
        'cover_image_id',
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
        return config('media.image_base_url') . '/' . $this->cover_image_id;
    }
}
