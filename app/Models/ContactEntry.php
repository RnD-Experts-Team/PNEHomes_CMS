<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactEntry extends Model
{
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone_number',
        'message',
        'land_area_sqft',
        'land_address',
    ];

    protected $casts = [
        'land_area_sqft' => 'integer',
    ];

    public function getFullNameAttribute(): string
    {
        return trim($this->first_name . ' ' . $this->last_name);
    }
}
