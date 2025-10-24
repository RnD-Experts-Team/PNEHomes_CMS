<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;


class AuthenticatedSessionController
{

       public function create(Request $request)
    {
        // MUST return the Inertia response, and the name must match the file path/case.
        return Inertia::render('Auth/Login');
    }
    // This replaces Fortify's POST /login
    public function store(Request $request)
    {
        // your custom login logic/validation
        $credentials = $request->validate([
            'email' => ['required','email'],
            'password' => ['required'],
        ]);

        $remember = (bool) $request->boolean('remember');

        if (! Auth::attempt($credentials, $remember)) {
            throw ValidationException::withMessages([
                'email' => __('These credentials do not match our records.'),
            ]);
        }

        $request->session()->regenerate();

        // whatever response you need (Inertia redirect/JSON/etc.)
        return redirect()->intended('/admin/home');
    }

        public function destroy(Request $request)
    {

        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login'); // or re direct()->route('login')
    }
    
}
