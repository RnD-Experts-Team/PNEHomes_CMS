<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HomeHero extends Model
{
    use HasFactory;

    protected $table = 'home_hero';

    protected $fillable = [
        'title',
        'subtitle',
    ];
}
