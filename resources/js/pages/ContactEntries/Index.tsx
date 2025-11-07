import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trash2, Eye, X, Tag, CheckSquare, Square, Plus, Pencil, Save, Trash } from 'lucide-react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useMemo, useState } from 'react';

interface Label {
  id: number;
  name: string;
}

interface ContactEntry {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  message: string;
  land_area_sqft?: number | null;
  land_address?: string | null;
  created_at: string;
  labels: Label[];
}

interface Paginated<T> {
  data: T[];
  links: { url: string | null; label: string; active: boolean }[];
  current_page: number;
  last_page: number;
  prev_page_url: string | null;
  next_page_url: string | null;
}

interface Props {
  entries: Paginated<ContactEntry>;
  labels: Label[];
  activeLabels: number[];
  flash?: { success?: string | null; error?: string | null };
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Contact Entries', href: '#' }];

function LabelChip({ label }: { label: Label }) {
  return (
    <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs" title={label.name}>
      <Tag className="mr-1 h-3 w-3" />
      {label.name}
    </span>
  );
}

/** shadcn multi-select combobox (Command + Popover) */
function LabelsCombobox({
  all, value, onChange, placeholder = 'Select labels…',
}: { all: Label[]; value: number[]; onChange: (ids: number[]) => void; placeholder?: string; }) {
  const [open, setOpen] = useState(false);
  const selectedSet = useMemo(() => new Set(value), [value]);
  const selectedLabels = useMemo(() => all.filter(l => selectedSet.has(l.id)), [all, selectedSet]);
  const display = selectedLabels.length ? selectedLabels.map(l => l.name).join(', ') : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className={cn("w-full justify-between")}>
          <span className={cn(!selectedLabels.length && "text-muted-foreground")}>{display}</span>
          <span className="ml-2 text-muted-foreground">⌄</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[320px]">
        <Command>
          <CommandInput placeholder="Search labels..." />
          <CommandEmpty>No labels found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {all.map((l) => {
                const checked = selectedSet.has(l.id);
                return (
                  <CommandItem
                    key={l.id}
                    value={l.name}
                    onSelect={() => {
                      const next = checked ? value.filter(id => id !== l.id) : [...value, l.id];
                      onChange(next);
                    }}
                  >
                    <div className="mr-2 w-4">
                      {checked ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                    </div>
                    {l.name}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

/** tiny combobox for mode selection (shadcn) */
function ModeCombobox({
  value, onChange,
}: { value: 'add' | 'remove' | 'replace'; onChange: (v: 'add'|'remove'|'replace') => void; }) {
  const [open, setOpen] = useState(false);
  const options = [
    { id: 'add', label: 'Add (keep existing)' },
    { id: 'remove', label: 'Remove (only selected)' },
    { id: 'replace', label: 'Replace (overwrite)' },
  ] as const;

  const current = options.find(o => o.id === value)?.label ?? 'Select…';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {current}
          <span className="ml-2 text-muted-foreground">⌄</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[240px]">
        <Command>
          <CommandList>
            <CommandGroup>
              {options.map(o => (
                <CommandItem key={o.id} onSelect={() => onChange(o.id as any)}>
                  {o.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default function ContactEntriesIndex({ entries, labels, activeLabels }: Props) {
  // view-only entry modal
  const [selected, setSelected] = useState<ContactEntry | null>(null);

  // bulk selection
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const allIdsOnPage = entries.data.map((e) => e.id);
  const allOnPageSelected = allIdsOnPage.length > 0 && allIdsOnPage.every((id) => selectedIds.includes(id));

  // bulk dialog
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkWorkingLabels, setBulkWorkingLabels] = useState<number[]>([]);
  const [bulkMode, setBulkMode] = useState<'add'|'remove'|'replace'>('add');

  // Labels manager dialog (create + edit + delete)
  const [labelsOpen, setLabelsOpen] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [editing, setEditing] = useState<Record<number, string>>({}); // id -> new name

  const handleDelete = (id: number) => {
    router.delete(`/admin/contact-entries/${id}`, { preserveScroll: true });
  };

  const pushFilter = (nextIds: number[]) => {
    const qs = new URLSearchParams();
    nextIds.forEach((v) => qs.append('labels[]', String(v)));
    router.get(`/admin/contact-entries${nextIds.length ? `?${qs.toString()}` : ''}`, {}, { preserveState: true, preserveScroll: true });
  };

  const goTo = (url: string | null) => {
    if (!url) return;
    router.get(url, {}, { preserveScroll: true, preserveState: true });
  };

  const toggleSelectId = (id: number) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const toggleSelectAllOnPage = () => {
    if (allOnPageSelected) {
      setSelectedIds((prev) => prev.filter((id) => !allIdsOnPage.includes(id)));
    } else {
      const set = new Set([...selectedIds, ...allIdsOnPage]);
      setSelectedIds(Array.from(set.values()));
    }
  };

  const startBulk = () => {
    if (selectedIds.length === 0) return;
    setBulkWorkingLabels([]);
    setBulkMode('add');
    setBulkOpen(true);
  };

  const confirmBulk = () => {
    router.put('/admin/contact-entries/bulk-labels', {
      entry_ids: selectedIds,
      label_ids: bulkWorkingLabels,
      mode: bulkMode,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setBulkOpen(false);
        setSelectedIds([]);
      },
    });
  };

  // Label Manager actions
  const createLabel = () => {
    const name = newLabel.trim();
    if (!name) return;
    router.post('/admin/contact-labels', { name }, {
      preserveScroll: true,
      onSuccess: () => {
        setNewLabel('');
        // refresh to pull server-updated labels list
        router.get(window.location.href, {}, { preserveScroll: true, replace: true });
      },
    });
  };

  const saveLabel = (id: number) => {
    const name = (editing[id] ?? '').trim();
    if (!name) return;
    router.put(`/admin/contact-labels/${id}`, { name }, {
      preserveScroll: true,
      onSuccess: () => {
        const next = { ...editing }; delete next[id]; setEditing(next);
        router.get(window.location.href, {}, { preserveScroll: true, replace: true });
      },
    });
  };

  const deleteLabel = (id: number) => {
    router.delete(`/admin/contact-labels/${id}`, {
      preserveScroll: true,
      onSuccess: () => {
        const next = { ...editing }; delete next[id]; setEditing(next);
        router.get(window.location.href, {}, { preserveScroll: true, replace: true });
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Contact Entries" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        {/* Header + Filter + Bulk toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-2xl font-bold">Contact Entries</h1>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter by labels */}
            <div className="w-72">
              <LabelsCombobox
                all={labels}
                value={activeLabels || []}
                onChange={(next) => pushFilter(next)}
                placeholder="Filter by labels…"
              />
            </div>
            {activeLabels?.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => pushFilter([])}>
                Clear
              </Button>
            )}

            {/* Bulk + Labels manager */}
            <div className="ml-4 flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={selectedIds.length === 0}
                onClick={startBulk}
              >
                <CheckSquare className="mr-2 h-4 w-4" />
                Labels for {selectedIds.length} selected
              </Button>

              <Button variant="outline" size="sm" onClick={() => setLabelsOpen(true)}>
                <Tag className="mr-2 h-4 w-4" />
                Labels
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <button onClick={toggleSelectAllOnPage} className="inline-flex items-center">
                    {allOnPageSelected ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                  </button>
                </TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Land</TableHead>
                <TableHead>Labels</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    No entries found
                  </TableCell>
                </TableRow>
              ) : (
                entries.data.map((e) => {
                  const checked = selectedIds.includes(e.id);
                  return (
                    <TableRow key={e.id}>
                      <TableCell>
                        <button onClick={() => toggleSelectId(e.id)} className="inline-flex items-center">
                          {checked ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                        </button>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{e.created_at}</TableCell>
                      <TableCell className="font-medium">
                        {e.first_name} {e.last_name}
                      </TableCell>
                      <TableCell className="max-w-md truncate">{e.email}</TableCell>
                      <TableCell className="max-w-md truncate">{e.phone_number}</TableCell>
                      <TableCell>
                        {e.land_area_sqft || e.land_address ? (
                          <Badge variant="default">Provided</Badge>
                        ) : (
                          <Badge variant="secondary">N/A</Badge>
                        )}
                      </TableCell>

                      <TableCell className="max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {e.labels?.length
                            ? e.labels.map((l) => <LabelChip key={l.id} label={l} />)
                            : <span className="text-xs text-muted-foreground">—</span>}
                        </div>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {/* View-only modal (no label assignment here) */}
                          <AlertDialog open={!!selected && selected?.id === e.id} onOpenChange={(open) => !open && setSelected(null)}>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelected(e)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Contact Entry</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Submitted on {e.created_at}
                                </AlertDialogDescription>
                              </AlertDialogHeader>

                              <div className="grid grid-cols-1 gap-2 text-sm">
                                <div><span className="font-medium">Name:</span> {e.first_name} {e.last_name}</div>
                                <div><span className="font-medium">Email:</span> {e.email}</div>
                                <div><span className="font-medium">Phone:</span> {e.phone_number}</div>
                                <div><span className="font-medium">Land Area (sqft):</span> {e.land_area_sqft ?? '—'}</div>
                                <div><span className="font-medium">Land Address:</span> {e.land_address ?? '—'}</div>
                                <div className="mt-2">
                                  <span className="font-medium">Message:</span>
                                  <p className="mt-1 rounded-md border p-3">{e.message}</p>
                                </div>
                                <div className="mt-2">
                                  <span className="font-medium">Labels:</span>
                                  <div className="mt-1 flex flex-wrap gap-1">
                                    {e.labels?.length
                                      ? e.labels.map((l) => <LabelChip key={l.id} label={l} />)
                                      : <span className="text-xs text-muted-foreground">—</span>}
                                  </div>
                                </div>
                              </div>

                              <AlertDialogFooter>
                                <AlertDialogAction onClick={() => setSelected(null)}>Close</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

                          {/* Delete entry */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Entry</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete contact entry for "{e.first_name} {e.last_name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(e.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Bulk labels dialog (assign only) */}
        <Dialog open={bulkOpen} onOpenChange={setBulkOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Bulk label assignment</DialogTitle>
              <DialogDescription>
                Apply labels to {selectedIds.length} selected entr{selectedIds.length === 1 ? 'y' : 'ies'}.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <label className="text-sm w-24">Mode</label>
                <div className="w-60">
                  <ModeCombobox value={bulkMode} onChange={setBulkMode} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm">Labels</div>
                <LabelsCombobox
                  all={labels}
                  value={bulkWorkingLabels}
                  onChange={setBulkWorkingLabels}
                  placeholder="Choose labels…"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="ghost" onClick={() => setBulkOpen(false)}>Cancel</Button>
              <Button onClick={confirmBulk}>Apply</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Labels Manager dialog: create + edit + delete */}
        <Dialog open={labelsOpen} onOpenChange={setLabelsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Labels</DialogTitle>
              <DialogDescription>Create, rename, or delete labels.</DialogDescription>
            </DialogHeader>

            {/* Create */}
            <div className="space-y-2">
              <label className="text-sm">Create new</label>
              <div className="flex gap-2">
                <Input
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="e.g. VIP, Needs follow-up"
                />
                <Button onClick={createLabel}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </Button>
              </div>
            </div>

            {/* Existing labels list */}
            <div className="mt-4 space-y-2">
              <div className="text-sm font-medium">Existing</div>
              <div className="max-h-72 overflow-auto rounded border">
                {labels.length === 0 ? (
                  <div className="p-3 text-sm text-muted-foreground">No labels yet.</div>
                ) : (
                  <ul className="divide-y">
                    {labels.map((l) => {
                      const isEditing = Object.prototype.hasOwnProperty.call(editing, l.id);
                      const val = isEditing ? editing[l.id] : l.name;
                      return (
                        <li key={l.id} className="flex items-center gap-2 p-2">
                          <div className="flex-1">
                            {isEditing ? (
                              <Input
                                value={val}
                                onChange={(e) => setEditing(prev => ({ ...prev, [l.id]: e.target.value }))}
                                className="h-9"
                              />
                            ) : (
                              <div className="text-sm">{l.name}</div>
                            )}
                          </div>
                          {!isEditing ? (
                            <>
                              <Button variant="ghost" size="icon" onClick={() => setEditing(prev => ({ ...prev, [l.id]: l.name }))} title="Rename">
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive"
                                onClick={() => deleteLabel(l.id)}
                                title="Delete"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button variant="ghost" size="icon" onClick={() => saveLabel(l.id)} title="Save">
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => {
                                const next = { ...editing }; delete next[l.id]; setEditing(next);
                              }} title="Cancel">
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                Deleting a label removes it from all entries. Entries remain intact.
              </div>
            </div>

            <DialogFooter>
              <Button onClick={() => setLabelsOpen(false)}>Done</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => goTo(entries.prev_page_url)}
            disabled={!entries.prev_page_url}
          >
            Previous
          </Button>
          <div className="text-sm">
            Page {entries.current_page} of {entries.last_page}
          </div>
          <Button
            variant="outline"
            onClick={() => goTo(entries.next_page_url)}
            disabled={!entries.next_page_url}
          >
            Next
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
