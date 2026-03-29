<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HasMediaUrl;

class EventGallery extends Model
{
    use HasFactory, HasMediaUrl;

    protected $fillable = [
        'event_id',
        'image_id',
        'image_type',
        'order',
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    protected $appends = ['url'];

    public function getUrlAttribute(): string
    {
        return $this->resolveMediaUrl($this->image_id, $this->image_type);
    }

    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}
