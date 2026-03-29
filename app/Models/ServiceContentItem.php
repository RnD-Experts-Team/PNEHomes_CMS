<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HasMediaUrl;

class ServiceContentItem extends Model
{
    use HasFactory, HasMediaUrl;

    protected $fillable = [
        'service_id',
        'image_id',
        'image_type',
        'sub_title',
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

    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}
