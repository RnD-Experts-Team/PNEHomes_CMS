<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;

Route::get('/login',[AuthenticatedSessionController::class, 'create'])->middleware(['guest']);
Route::post('/login',[AuthenticatedSessionController::class, 'store'])->middleware(['guest']);
Route::post('/logout',[AuthenticatedSessionController::class, 'destroy'])->name('logout');