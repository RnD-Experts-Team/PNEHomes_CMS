<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventGallery extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',
        'image_id',
        'order',
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    protected $appends = ['url'];

    public function getUrlAttribute(): string
    {
        return config('media.image_base_url') . '/' . $this->image_id;
    }

    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}
