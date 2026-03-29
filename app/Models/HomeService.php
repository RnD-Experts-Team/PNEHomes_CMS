<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HasMediaUrl;

class HomeService extends Model
{
    use HasFactory, HasMediaUrl;

    protected $table = 'home_services';

    protected $fillable = [
        'title',
        'cover_image_id',
        'cover_image_type',
        'description',
    ];

    protected $appends = ['cover_url'];

    public function getCoverUrlAttribute(): string
    {
        return $this->resolveMediaUrl($this->cover_image_id, $this->cover_image_type);
    }
}
