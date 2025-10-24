import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus, ArrowLeft } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface SocialLink {
    id: number;
    platform: string;
    url: string;
    order: number;
}

interface Props {
    links: SocialLink[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Layout & Settings', href: '/admin/layout' },
    { title: 'Social Links', href: '#' },
];

export default function SocialLinksIndex({ links }: Props) {
    const handleDelete = (id: number) => {
        router.delete(`/admin/social-links/${id}`, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Social Links" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link href="/admin/layout">
                            <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                        </Link>
                        <h1 className="text-2xl font-bold">Social Links</h1>
                    </div>
                    <Link href="/admin/social-links/create">
                        <Button><Plus className="mr-2 h-4 w-4" />Add Link</Button>
                    </Link>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order</TableHead>
                                <TableHead>Platform</TableHead>
                                <TableHead>URL</TableHead>
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
                                        <TableCell>
                                            <Badge variant="outline" className="capitalize">{link.platform}</Badge>
                                        </TableCell>
                                        <TableCell className="max-w-md truncate font-mono text-sm">{link.url}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/admin/social-links/${link.id}/edit`}>
                                                    <Button variant="outline" size="sm"><Pencil className="h-4 w-4" /></Button>
                                                </Link>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="outline" size="sm" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Delete Link</AlertDialogTitle>
                                                            <AlertDialogDescription>Are you sure you want to delete this {link.platform} link?</AlertDialogDescription>
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
