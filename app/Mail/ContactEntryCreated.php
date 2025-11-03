<?php

namespace App\Mail;

use App\Models\ContactEntry;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ContactEntryCreated extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public ContactEntry $entry) {}

    // app/Mail/ContactEntryCreated.php
public function build()
{
    return $this->subject('New Contact Entry: ' . $this->entry->full_name)
        ->view('emails.contact.entry-created', [
            'entry' => $this->entry,
            'appName' => config('app.name'),
            'appUrl' => config('app.url'),
        ]);
}

}
