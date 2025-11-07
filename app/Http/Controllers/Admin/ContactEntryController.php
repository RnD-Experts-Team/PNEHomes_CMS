<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactEntry;
use App\Models\Label;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ContactEntryController extends Controller
{
    /**
     * Index with optional label filters.
     * Query: labels[]=1&labels[]=2  (matches ALL selected labels)
     */
    public function index(Request $request)
    {
        $labelIds = collect($request->input('labels', []))
            ->filter(fn($v) => is_numeric($v))
            ->map(fn($v) => (int) $v)
            ->values();

        $query = ContactEntry::query()
            ->latest()
            ->with('labels:id,name');

        if ($labelIds->isNotEmpty()) {
    $query->whereHas('labels', function ($q) use ($labelIds) {
        $q->whereIn('labels.id', $labelIds);
    }); // no count comparator = ANY
}

        $entries = $query->paginate(10)->withQueryString()
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
                    'labels' => $e->labels->map(fn($l) => [
                        'id' => $l->id,
                        'name' => $l->name,
                    ]),
                ];
            });

        $allLabels = Label::orderBy('name')->get(['id','name']);

        return Inertia::render('ContactEntries/Index', [
            'entries'      => $entries,
            'labels'       => $allLabels,
            'activeLabels' => $labelIds,
            'flash'        => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);
    }

    /** Delete an entry */
    public function destroy(ContactEntry $contactEntry)
    {
        $contactEntry->delete();
        return back()->with('success', 'Entry deleted.');
    }

    /** Create a label (separate dialog; no JSON) */
    public function labelStore(Request $request)
    {
        $data = $request->validate([
            'name' => ['required','string','max:100','unique:labels,name'],
        ]);

        Label::create($data);
        return back()->with('success', 'Label created.');
    }

    /** Update label */
    public function labelUpdate(Request $request, Label $label)
    {
        $data = $request->validate([
            'name' => ['required','string','max:100', Rule::unique('labels', 'name')->ignore($label->id)],
        ]);

        $label->update($data);
        return back()->with('success', 'Label updated.');
    }

    /** Delete label */
    public function labelDestroy(Label $label)
    {
        $label->delete();
        return back()->with('success', 'Label deleted.');
    }

    /** Replace labels for a single entry (UI does not use this now) */
    public function updateEntryLabels(Request $request, ContactEntry $contactEntry)
    {
        $data = $request->validate([
            'label_ids'   => ['array'],
            'label_ids.*' => ['integer','exists:labels,id'],
        ]);

        $contactEntry->labels()->sync($data['label_ids'] ?? []);
        return back()->with('success', 'Labels updated.');
    }

    /**
     * Bulk label operations on many entries.
     * mode: 'add' | 'remove' | 'replace'  (default: 'add')
     * payload: entry_ids[], label_ids[], mode?
     */
    public function bulkUpdateLabels(Request $request)
    {
        $data = $request->validate([
            'entry_ids'   => ['required','array','min:1'],
            'entry_ids.*' => ['integer','exists:contact_entries,id'],
            'label_ids'   => ['array'],
            'label_ids.*' => ['integer','exists:labels,id'],
            'mode'        => ['nullable','in:add,remove,replace'],
        ]);

        $entryIds = $data['entry_ids'];
        $labelIds = $data['label_ids'] ?? [];
        $mode     = $data['mode'] ?? 'add';

        $entries = ContactEntry::with('labels:id')->whereIn('id', $entryIds)->get();

        foreach ($entries as $entry) {
            $current = $entry->labels->pluck('id')->all();

            if ($mode === 'replace') {
                $entry->labels()->sync($labelIds);
                continue;
            }

            if ($mode === 'add') {
                $new = array_unique(array_merge($current, $labelIds));
                $entry->labels()->sync($new);
                continue;
            }

            // remove
            $new = array_values(array_diff($current, $labelIds));
            $entry->labels()->sync($new);
        }

        return back()->with('success', 'Bulk labels updated.');
    }
}
