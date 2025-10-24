import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus, ArrowLeft } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface HeroSection {
    id: number;
    icon: 'date' | 'pen' | 'home';
    title: string;
    description?: string;
    order: number;
}

interface Props {
    sections: HeroSection[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home Page', href: '/admin/home' },
    { title: 'Hero Sections', href: '#' },
];

export default function HeroSectionsIndex({ sections }: Props) {
    const handleDelete = (id: number) => {
        router.delete(`/admin/home-hero-sections/${id}`, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Hero Sections" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link href="/admin/home">
                            <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                        </Link>
                        <h1 className="text-2xl font-bold">Hero Sections</h1>
                    </div>
                    <Link href="/admin/home-hero-sections/create">
                        <Button><Plus className="mr-2 h-4 w-4" />Add Section</Button>
                    </Link>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order</TableHead>
                                <TableHead>Icon</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sections.length === 0 ? (
                                <TableRow><TableCell colSpan={5} className="text-center">No sections found</TableCell></TableRow>
                            ) : (
                                sections.map((section) => (
                                    <TableRow key={section.id}>
                                        <TableCell>{section.order}</TableCell>
                                        <TableCell><Badge variant="outline">{section.icon}</Badge></TableCell>
                                        <TableCell className="font-medium">{section.title}</TableCell>
                                        <TableCell className="max-w-md truncate">{section.description || '-'}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/admin/home-hero-sections/${section.id}/edit`}>
                                                    <Button variant="outline" size="sm"><Pencil className="h-4 w-4" /></Button>
                                                </Link>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="outline" size="sm" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Delete Section</AlertDialogTitle>
                                                            <AlertDialogDescription>Are you sure you want to delete "{section.title}"?</AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDelete(section.id)}>Delete</AlertDialogAction>
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
