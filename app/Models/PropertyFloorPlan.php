<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PropertyFloorPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_id',
        'title',
        'image_id',
        'description',
        'order',
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    protected $appends = ['img'];

    public function getImgAttribute(): string
    {
        return config('media.image_base_url') . '/' . $this->image_id;
    }

    public function property()
    {
        return $this->belongsTo(Property::class);
    }
}
