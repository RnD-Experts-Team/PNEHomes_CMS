<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactInfoNavigation extends Model
{
    use HasFactory;

    protected $table = 'contact_info_navigation';

    protected $fillable = [
        'phone',
        'button',
    ];
}
