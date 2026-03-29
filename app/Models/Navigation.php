<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HasMediaUrl;

class Navigation extends Model
{
    use HasFactory, HasMediaUrl;

    protected $table = 'navigation';

    protected $fillable = [
        'logo_image_id',
        'logo_image_type',
    ];

    protected $appends = ['logo_url'];

    public function getLogoUrlAttribute(): string
    {
        return $this->resolveMediaUrl($this->logo_image_id, $this->logo_image_type);
    }
}
