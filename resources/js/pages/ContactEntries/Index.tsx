import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus, Settings, Eye } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';

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
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Contact Entries', href: '#' },
];

export default function ContactEntriesIndex({ entries }: Props) {
    const [selected, setSelected] = useState<ContactEntry | null>(null);

    const handleDelete = (id: number) => {
        router.delete(`/admin/contact-entries/${id}`, {
            preserveScroll: true,
        });
    };

    const goTo = (url: string | null) => {
        if (!url) return;
        router.get(url, {}, { preserveScroll: true, preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Contact Entries" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Contact Entries</h1>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Submitted</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Land</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {entries.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center">
                                        No entries found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                entries.data.map((e) => (
                                    <TableRow key={e.id}>
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
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                {/* View (Modal) */}
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
                                                        </div>
                                                        <AlertDialogFooter>
                                                            <AlertDialogAction onClick={() => setSelected(null)}>Close</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>

                                                {/* Delete */}
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
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Simple Pagination */}
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
