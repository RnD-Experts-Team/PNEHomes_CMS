<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactEntry;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactEntryController extends Controller
{
    public function index(Request $request)
    {
        $entries = ContactEntry::query()
            ->latest()
            ->paginate(10)
            ->through(function ($e) {
                return [
                    'id' => $e->id,
                    'first_name' => $e->first_name,
                    'last_name' => $e->last_name,
                    'email' => $e->email,
                    'phone_number' => $e->phone_number,
                    'land_area_sqft' => $e->land_area_sqft,
                    'land_address' => $e->land_address,
                    'message' => $e->message,
                    'created_at' => $e->created_at->format('Y-m-d H:i'),
                ];
            });

        return Inertia::render('ContactEntries/Index', [
            'entries' => $entries,
        ]);
    }

    public function destroy(ContactEntry $contactEntry)
    {
        $contactEntry->delete();

        return back()->with('success', 'Entry deleted.');
    }
}
