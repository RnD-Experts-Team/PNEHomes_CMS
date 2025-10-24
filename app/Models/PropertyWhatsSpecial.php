<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PropertyWhatsSpecial extends Model
{
    use HasFactory;

    protected $table = 'property_whats_specials';

    protected $fillable = [
        'property_id',
        'badges',
        'description',
    ];

    protected $casts = [
        'badges' => 'array',
    ];

    public function property()
    {
        return $this->belongsTo(Property::class);
    }
}
