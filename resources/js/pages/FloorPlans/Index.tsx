import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface FloorPlan {
    id: number;
    slug: string;
    title: string;
    bedroom: number;
    bathroom: number;
    floor: number;
    area: number;
    order: number;
    is_active: boolean;
}

interface Props {
    floorPlans: FloorPlan[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Floor Plans', href: '#' },
];

export default function FloorPlansIndex({ floorPlans }: Props) {
    const handleDelete = (id: number) => {
        router.delete(`/admin/floor-plans/${id}`, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Floor Plans" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Floor Plans</h1>
                    <Link href="/admin/floor-plans/create">
                        <Button><Plus className="mr-2 h-4 w-4" />Add Floor Plan</Button>
                    </Link>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Bedroom</TableHead>
                                <TableHead>Bathroom</TableHead>
                                <TableHead>Floor</TableHead>
                                <TableHead>Area (sqft)</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {floorPlans.length === 0 ? (
                                <TableRow><TableCell colSpan={9} className="text-center">No floor plans found</TableCell></TableRow>
                            ) : (
                                floorPlans.map((plan) => (
                                    <TableRow key={plan.id}>
                                        <TableCell>{plan.order}</TableCell>
                                        <TableCell className="font-medium">{plan.title}</TableCell>
                                        <TableCell><code className="rounded bg-muted px-2 py-1 text-sm">{plan.slug}</code></TableCell>
                                        <TableCell>{plan.bedroom}</TableCell>
                                        <TableCell>{plan.bathroom}</TableCell>
                                        <TableCell>{plan.floor}</TableCell>
                                        <TableCell>{plan.area.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Badge variant={plan.is_active ? 'default' : 'secondary'}>
                                                {plan.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/admin/floor-plans/${plan.id}/edit`}>
                                                    <Button variant="outline" size="sm"><Pencil className="h-4 w-4" /></Button>
                                                </Link>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="outline" size="sm" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Delete Floor Plan</AlertDialogTitle>
                                                            <AlertDialogDescription>Are you sure you want to delete "{plan.title}"?</AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDelete(plan.id)}>Delete</AlertDialogAction>
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
