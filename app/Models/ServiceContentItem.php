<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceContentItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'service_id',
        'image_id',
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
        return config('media.image_base_url') . '/' . $this->image_id;
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}
