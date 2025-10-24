<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PropertyFactsFeature extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_id',
        'title',
        'list',
        'order',
    ];

    protected $casts = [
        'list' => 'array',
        'order' => 'integer',
    ];

    public function property()
    {
        return $this->belongsTo(Property::class);
    }
}
