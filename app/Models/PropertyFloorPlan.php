<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HasMediaUrl;

class PropertyFloorPlan extends Model
{
    use HasFactory, HasMediaUrl;

    protected $fillable = [
        'property_id',
        'title',
        'image_id',
        'image_type',
        'description',
        'order',
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    protected $appends = ['img'];

    public function getImgAttribute(): string
    {
        return $this->resolveMediaUrl($this->image_id, $this->image_type);
    }

    public function property()
    {
        return $this->belongsTo(Property::class);
    }
}
