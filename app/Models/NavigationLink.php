<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NavigationLink extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'order',
    ];

    protected $casts = [
        'order' => 'integer',
    ];
}
