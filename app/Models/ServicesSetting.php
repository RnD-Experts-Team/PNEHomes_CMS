<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\HasMediaUrl;

class ServicesSetting extends Model
{
    use HasMediaUrl;
    protected $fillable = [
        'image_id',
        'image_type',
    ];
    protected $appends = ['img'];
    public function getImgAttribute(): string
    {
        return $this->resolveMediaUrl($this->image_id, $this->image_type);
    }
}
