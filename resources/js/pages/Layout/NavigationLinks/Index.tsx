import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash2, Plus, ArrowLeft } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface NavigationLink {
    id: number;
    title: string;
    slug: string;
    order: number;
}

interface Props {
    links: NavigationLink[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Layout & Settings', href: '/admin/layout' },
    { title: 'Navigation Links', href: '#' },
];

export default function NavigationLinksIndex({ links }: Props) {
    const handleDelete = (id: number) => {
        router.delete(`/admin/navigation-links/${id}`, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Navigation Links" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link href="/admin/layout">
                            <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                        </Link>
                        <h1 className="text-2xl font-bold">Navigation Links</h1>
                    </div>
                    <Link href="/admin/navigation-links/create">
                        <Button><Plus className="mr-2 h-4 w-4" />Add Link</Button>
                    </Link>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {links.length === 0 ? (
                                <TableRow><TableCell colSpan={4} className="text-center">No links found</TableCell></TableRow>
                            ) : (
                                links.map((link) => (
                                    <TableRow key={link.id}>
                                        <TableCell>{link.order}</TableCell>
                                        <TableCell className="font-medium">{link.title}</TableCell>
                                        <TableCell><code className="rounded bg-muted px-2 py-1 text-sm">{link.slug}</code></TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/admin/navigation-links/${link.id}/edit`}>
                                                    <Button variant="outline" size="sm"><Pencil className="h-4 w-4" /></Button>
                                                </Link>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="outline" size="sm" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Delete Link</AlertDialogTitle>
                                                            <AlertDialogDescription>Are you sure you want to delete "{link.title}"?</AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDelete(link.id)}>Delete</AlertDialogAction>
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
            </div>
        </AppLayout>
    );
}
