<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServicesSetting extends Model
{
    Protected $fillable=[
'image_id'
    ];
        protected $appends = ['img'];
    public function getImgAttribute(): string
    {
        return config('media.image_base_url') . '/' . $this->image_id;
    }
}
