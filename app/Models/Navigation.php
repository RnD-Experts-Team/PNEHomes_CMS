<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Navigation extends Model
{
    use HasFactory;

    protected $table = 'navigation';

    protected $fillable = [
        'logo_image_id',
    ];

    protected $appends = ['logo_url'];

    public function getLogoUrlAttribute(): string
    {
        return config('media.image_base_url') . '/' . $this->logo_image_id;
    }
}
