<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\ContactEntryCreated;
use App\Models\ContactEntry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactEntryController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'first_name'      => ['required','string','max:255'],
            'last_name'       => ['required','string','max:255'],
            'email'           => ['required','email','max:255'],
            'phone_number'    => ['required','string','max:255'],
            'message'         => ['required','string'],
            'land_area_sqft'  => ['nullable','integer','min:0'],
            'land_address'    => ['nullable','string','max:255'],
        ]);

        $entry = ContactEntry::create($data);

        // Send notification email to configured recipient
        $to = config('contact.notify_to');
        if ($to) {
            Mail::to($to)->send(new ContactEntryCreated($entry));
        }

        // "Normal JSON" back to frontend
        return response()->json([
            'success' => true,
            'data' => [
                'id' => $entry->id,
                'first_name' => $entry->first_name,
                'last_name' => $entry->last_name,
                'email' => $entry->email,
                'phone_number' => $entry->phone_number,
                'message' => $entry->message,
                'land_area_sqft' => $entry->land_area_sqft,
                'land_address' => $entry->land_address,
                'created_at' => $entry->created_at,
            ],
        ], 201);
    }
}
