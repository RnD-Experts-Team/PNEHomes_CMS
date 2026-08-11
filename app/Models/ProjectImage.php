<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HasMediaUrl;

class ProjectImage extends Model
{
    use HasFactory, HasMediaUrl;

    protected $fillable = [
        'lot_id',
        'room_id',
        'virtual_image_id',
        'real_image_id',
        'virtual_image_type',
        'real_image_type',
        'order',
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    protected $appends = ['virtual_url', 'real_url'];

    public function getVirtualUrlAttribute(): ?string
    {
        return $this->virtual_image_id
            ? $this->resolveMediaUrl($this->virtual_image_id, $this->virtual_image_type)
            : null;
    }

    public function getRealUrlAttribute(): ?string
    {
        return $this->real_image_id
            ? $this->resolveMediaUrl($this->real_image_id, $this->real_image_type)
            : null;
    }

    public function lot()
    {
        return $this->belongsTo(ProjectLot::class, 'lot_id');
    }

    public function room()
    {
        return $this->belongsTo(ProjectRoom::class, 'room_id');
    }
}
