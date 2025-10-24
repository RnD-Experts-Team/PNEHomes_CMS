import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus, ArrowLeft } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface Testimonial {
    id: number;
    description: string;
    by: string;
    order: number;
    is_active: boolean;
}

interface Props {
    testimonials: Testimonial[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home Page', href: '/admin/home' },
    { title: 'Testimonials', href: '#' },
];

export default function TestimonialsIndex({ testimonials }: Props) {
    const handleDelete = (id: number) => {
        router.delete(`/admin/home-testimonials/${id}`, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Testimonials" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link href="/admin/home">
                            <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                        </Link>
                        <h1 className="text-2xl font-bold">Testimonials</h1>
                    </div>
                    <Link href="/admin/home-testimonials/create">
                        <Button><Plus className="mr-2 h-4 w-4" />Add Testimonial</Button>
                    </Link>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>By</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {testimonials.length === 0 ? (
                                <TableRow><TableCell colSpan={5} className="text-center">No testimonials found</TableCell></TableRow>
                            ) : (
                                testimonials.map((testimonial) => (
                                    <TableRow key={testimonial.id}>
                                        <TableCell>{testimonial.order}</TableCell>
                                        <TableCell className="max-w-md truncate">{testimonial.description}</TableCell>
                                        <TableCell className="font-medium">{testimonial.by}</TableCell>
                                        <TableCell>
                                            <Badge variant={testimonial.is_active ? 'default' : 'secondary'}>
                                                {testimonial.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/admin/home-testimonials/${testimonial.id}/edit`}>
                                                    <Button variant="outline" size="sm"><Pencil className="h-4 w-4" /></Button>
                                                </Link>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="outline" size="sm" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Delete Testimonial</AlertDialogTitle>
                                                            <AlertDialogDescription>Are you sure you want to delete this testimonial by "{testimonial.by}"?</AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDelete(testimonial.id)}>Delete</AlertDialogAction>
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
